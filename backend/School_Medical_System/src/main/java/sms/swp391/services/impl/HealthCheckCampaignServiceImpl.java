package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.HealthCheckCampaignRequestDTO;
import sms.swp391.models.dtos.responses.ApprovedEventResponse;
import sms.swp391.models.dtos.responses.HealthCheckCampaignResponse;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.AuthFailedException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.HealthCheckCampaignService;
import sms.swp391.services.NotificationService;
import sms.swp391.services.SendMailService;
import sms.swp391.utils.HealthCheckCampaignMapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthCheckCampaignServiceImpl implements HealthCheckCampaignService {

    private final HealthCheckCampaignRepository campaignRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final NotificationService notificationService;
    private final HealthCheckConsentRepository healthCheckConsentRepository;
    private final SendMailService sendMailService;
    private final HealthConsultationScheduleRepository healthConsultationScheduleRepository;
    private final VaccinationConsentRepository vaccinationConsentRepository;

    @Override
    public List<ApprovedEventResponse> getApprovedEventsByStudentId(Long studentId) {
        List<ApprovedEventResponse> events = new ArrayList<>();

        List<HealthCheckConsentEntity> healthCheckConsents =
                healthCheckConsentRepository.findByStudentIdAndConsentStatus(studentId, MedicalStatus.APPROVED);

        for (HealthCheckConsentEntity consent : healthCheckConsents) {
            HealthCheckCampaignEntity campaign = consent.getHealthCheckCampaign();
            events.add(ApprovedEventResponse.builder()
                    .eventType("HEALTH_CHECK")
                    .campaignId(campaign.getId())
                    .campaignName(campaign.getName())
                    .description(campaign.getDescription())
                    .startDate(campaign.getStartDate())
                    .endDate(campaign.getEndDate())
                    .academicYear(consent.getAcademicYear())
                    .build());
        }

        List<VaccinationConsentEntity> vaccinationConsents =
                vaccinationConsentRepository.findByStudentIdAndConsentStatus(studentId, MedicalStatus.APPROVED);

        for (VaccinationConsentEntity consent : vaccinationConsents) {
            VaccinationCampaignEntity campaign = consent.getVaccinationCampaign();
            events.add(ApprovedEventResponse.builder()
                    .eventType("VACCINATION")
                    .campaignId(campaign.getId())
                    .campaignName(campaign.getName())
                    .description(campaign.getDescription())
                    .startDate(campaign.getStartDate())
                    .endDate(campaign.getEndDate())
                    .academicYear(consent.getAcademicYear())
                    .build());
        }

        return events;
    }


    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserEntity u) return u.getUserId();
        if (principal instanceof String anonymous)
            throw new AuthFailedException("Unauthenticated user: " + anonymous);
        throw new AuthFailedException("Invalid principal type: " + principal.getClass());
    }


    @Override
    @Transactional
    public void endCampaign(Long campaignId) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));
        if (campaign.getEndDate().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Chiến dịch chưa tới ngày kết thúc. Ngày kết thúc là: " + campaign.getEndDate());
        }

        campaign.setStatus(MedicalStatus.DONE);
        campaignRepository.save(campaign);

        List<HealthCheckConsentEntity> consents = healthCheckConsentRepository.findByHealthCheckCampaignId(campaignId);

        List<HealthCheckConsentEntity> toUpdate = new ArrayList<>();
        for (HealthCheckConsentEntity consent : consents) {
            if (MedicalStatus.PENDING.equals(consent.getConsentStatus())) {
                consent.setConsentStatus(MedicalStatus.REJECTED);
                consent.setResponseDate(LocalDate.now());
                toUpdate.add(consent);

                notificationService.push(
                        campaign.getCreatedBy().getUserId(),
                        consent.getParent().getUserId(),
                        "Chiến dịch kiểm tra sức khỏe đã kết thúc",
                        "Bạn chưa phản hồi đồng ý cho con tham gia chiến dịch \"" + campaign.getName() + "\". "
                                + "Chiến dịch hiện đã kết thúc."
                );
            }
        }

        // 4. Lưu các consent bị cập nhật
        if (!toUpdate.isEmpty()) {
            healthCheckConsentRepository.saveAll(toUpdate);
        }
    }

    private String getCurrentAcademicYear() {
        int y = LocalDate.now().getYear();
        return y + "-" + (y + 1);   // ví dụ 2025-2026
    }

    @Transactional
    @Override
    public HealthCheckCampaignResponse createCampaign(HealthCheckCampaignRequestDTO req,
                                                      Long createdById) {

        UserEntity creator = userRepository.findById(createdById)
                .orElseThrow(() -> new NotFoundException("User not found " + createdById));

        HealthCheckCampaignEntity campaign = HealthCheckCampaignMapper.fromRequestDTO(req);
        campaign.setCreatedBy(creator);
        campaign.setStatus(MedicalStatus.PENDING);
        campaign.setCreatedAt(LocalDateTime.now().withSecond(0).withNano(0));

        campaign = campaignRepository.save(campaign);

        // Lưu consent cho từng học sinh, KHÔNG gửi mail
        List<StudentEntity> students =
                studentRepository.findByGradesWithUserAndParent(req.getTargetGrade());

        for (StudentEntity s : students) {
            HealthCheckConsentEntity consent = HealthCheckConsentEntity.builder()
                    .healthCheckCampaign(campaign)
                    .student(s)
                    .parent(s.getParent())
                    .consentStatus(MedicalStatus.PENDING)
                    .academicYear(getCurrentAcademicYear())
                    .build();
            healthCheckConsentRepository.save(consent);
        }

        return HealthCheckCampaignMapper.toDTO(campaign);
    }
    @Override
    public void sendConsentEmails(Long campaignId, Long triggeredByUserId) {

        HealthCheckCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found: " + campaignId));

        UserEntity triggerUser = userRepository.findById(triggeredByUserId)
                .orElseThrow(() -> new NotFoundException("User not found: " + triggeredByUserId));

        List<HealthCheckConsentEntity> consents =
                healthCheckConsentRepository.findAllByHealthCheckCampaignId(campaignId);

        Map<Long, HealthCheckConsentEntity> firstConsentPerParent = new HashMap<>();
        for (HealthCheckConsentEntity c : consents) {
            firstConsentPerParent.putIfAbsent(c.getParent().getUserId(), c);
        }

        ExecutorService pool = Executors.newFixedThreadPool(10);

        firstConsentPerParent.values().forEach(consent -> {
            pool.submit(() -> {

                UserEntity parent = consent.getParent();
                StudentEntity student = consent.getStudent();
                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");

                sendMailService.sendConsentRequestEmail(
                        parent.getEmail(),
                        parent.getFullname(),
                        student.getUser().getFullname(),
                        campaign.getName(),
                        campaign.getStartDate().format(fmt),
                        campaign.getEndDate().format(fmt),
                        campaign.getLocation()
                );

                notificationService.push(
                        triggerUser.getUserId(),
                        parent.getUserId(),
                        "Yêu cầu đồng ý khám sức khỏe",
                        "Vui lòng xác nhận chiến dịch " + campaign.getName()
                );
            });
        });

        pool.shutdown();
    }

    @Override
    @Transactional
    public HealthCheckCampaignResponse updateCampaign(Long id, HealthCheckCampaignRequestDTO request) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));

        campaign.setName(request.getName());
        campaign.setDescription(request.getDescription());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        campaign.setTargetGrade(
                request.getTargetGrade() != null
                        ? String.join(",", request.getTargetGrade())
                        : campaign.getTargetGrade()
        );
        campaign.setLocation(request.getLocation());

        campaignRepository.save(campaign);

        List<StudentEntity> newStudents = studentRepository.findByGradesWithUserAndParent(request.getTargetGrade());
        Set<Long> newStudentIds = newStudents.stream()
                .map(StudentEntity::getId)
                .collect(Collectors.toSet());

        List<HealthCheckConsentEntity> oldConsents = healthCheckConsentRepository.findByHealthCheckCampaignId(campaign.getId());
        Set<Long> oldStudentIds = oldConsents.stream()
                .map(c -> c.getStudent().getId())
                .collect(Collectors.toSet());

        Set<Long> notifiedParents = new HashSet<>();

        // 4. Đánh dấu DELETED hoặc xóa những học sinh không còn thuộc khối mới
        for (HealthCheckConsentEntity oldConsent : oldConsents) {
            Long studentId = oldConsent.getStudent().getId();
            if (!newStudentIds.contains(studentId)) {
                if (oldConsent.getConsentStatus() == MedicalStatus.PENDING) {
                    healthCheckConsentRepository.delete(oldConsent); // xóa nếu chưa đồng ý
                } else {
                    oldConsent.setConsentStatus(MedicalStatus.DELETED); // đánh dấu nếu đã tương tác
                    healthCheckConsentRepository.save(oldConsent);
                }

                Long parentId = oldConsent.getParent().getUserId();
                if (notifiedParents.add(parentId)) {
                    notificationService.push(
                            getCurrentUserId(), parentId,
                            "Chiến dịch kiểm tra sức khỏe",
                            "Học sinh " + oldConsent.getStudent().getUser().getFullname()
                                    + " không còn thuộc chiến dịch \"" + campaign.getName() + "\" sau khi cập nhật."
                    );
                }
            }
        }

        for (StudentEntity student : newStudents) {
            if (!oldStudentIds.contains(student.getId())) {
                // Tạo consent mới
                HealthCheckConsentEntity newConsent = HealthCheckConsentEntity.builder()
                        .healthCheckCampaign(campaign)
                        .student(student)
                        .parent(student.getParent())
                        .consentStatus(MedicalStatus.PENDING)
                        .academicYear(getCurrentAcademicYear())
                        .build();
                healthCheckConsentRepository.save(newConsent);

                Long parentId = student.getParent().getUserId();
                if (notifiedParents.add(parentId)) {
                    // Gửi thông báo
                    notificationService.push(
                            getCurrentUserId(), parentId,
                            "Yêu cầu đồng ý khám sức khỏe",
                            "Vui lòng xác nhận chiến dịch \"" + campaign.getName()
                                    + "\" dành cho học sinh " + student.getUser().getFullname()
                    );

//                    // Gửi email nếu cần
//                    sendMailService.sendConsentRequestEmail(
//                            student.getParent().getEmail(),
//                            student.getParent().getFullname(),
//                            student.getUser().getFullname(),
//                            campaign.getName(),
//                            campaign.getStartDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
//                            campaign.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
//                            "Khám sức khỏe định kỳ"
//                    );
                }
            }
        }

        return HealthCheckCampaignMapper.toDTO(campaign);
    }

    @Override
    public void startCampaign(Long campaignId) {
        HealthCheckCampaignEntity c = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found"));
        if (c.getStartDate().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Chiến dịch chưa tới ngày bắt đầu. Ngày bắt đầu là: " + c.getEndDate());
        }
        c.setStatus(MedicalStatus.APPROVED);
        campaignRepository.save(c);
    }



    @Override
    public HealthCheckCampaignResponse getCampaignById(Long id) {
        return campaignRepository.findById(id)
                .map(HealthCheckCampaignMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));
    }

    @Override
    public List<HealthCheckCampaignResponse> getAllCampaigns() {
        return campaignRepository.findAll().stream()
                .map(HealthCheckCampaignMapper::toDTO)
                .toList();
    }

    @Override
    public List<HealthCheckCampaignResponse> getAllCampaignsStart() {
        return campaignRepository.getAllByHealthCheckCampaign().stream()
                .map(HealthCheckCampaignMapper::toDTO)
                .toList();
    }

    @Override
    public void deleteCampaign(Long campaignId) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));
        campaign.setStatus(MedicalStatus.REJECTED);
        List<HealthCheckConsentEntity> consents =
                healthCheckConsentRepository.findAllByHealthCheckCampaignId(campaignId);
        for (HealthCheckConsentEntity c : consents) {
            c.setConsentStatus(MedicalStatus.REJECTED);
        }

        // 3. Lưu
        healthCheckConsentRepository.saveAll(consents);
        campaignRepository.save(campaign);
    }
    @Override
    @Transactional
    public void remindUnconfirmedParents(Long campaignId) {
        var campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Not found"));

        List<HealthCheckConsentEntity> pendingConsents =
                healthCheckConsentRepository.findByHealthCheckCampaign_IdAndConsentStatus(campaignId, MedicalStatus.PENDING);

        for (var consent : pendingConsents) {
            var parent = consent.getParent();
            var student = consent.getStudent().getUser();

            sendMailService.sendReminderEmail(
                    parent.getEmail(),
                    parent.getFullname(),
                    student.getFullname(),
                    campaign.getName(),
                    campaign.getStartDate().toString(),
                    campaign.getEndDate().toString(),
                    campaign.getLocation()
            );

            notificationService.push(
                    getCurrentUserId(),
                    parent.getUserId(),
                    "Nhắc nhở xác nhận khám sức khỏe",
                    "Bạn chưa xác nhận chiến dịch " + campaign.getName() + " của học sinh " + student.getFullname()
            );
        }
    }

}

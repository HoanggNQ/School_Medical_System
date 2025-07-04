package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.HealthCheckCampaignRequestDTO;
import sms.swp391.models.dtos.responses.HealthCheckCampaignResponse;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.HealthCheckCampaignService;
import sms.swp391.services.NotificationService;
import sms.swp391.services.SendMailService;
import sms.swp391.utils.HealthCheckCampaignMapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    private Long getCurrentUserId() {
        var principal = (UserEntity) org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return principal.getUserId();
    }

    @Override
    public void endCampaign(Long campaignId) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));
        campaign.setStatus(MedicalStatus.DONE);
        campaignRepository.save(campaign);
    }
    private String getCurrentAcademicYear() {
        int y = LocalDate.now().getYear();
        return y + "-" + (y + 1);   // ví dụ 2025-2026
    }

    @Override
    public HealthCheckCampaignResponse createCampaign(HealthCheckCampaignRequestDTO req, Long createdById) {

        UserEntity creator = userRepository.findById(createdById)
                .orElseThrow(() -> new NotFoundException("User not found " + createdById));

        HealthCheckCampaignEntity campaign = HealthCheckCampaignMapper.fromRequestDTO(req);
        campaign.setCreatedBy(creator);
        campaign.setStatus(MedicalStatus.PENDING);
        campaign.setCreatedAt(LocalDateTime.now().withSecond(0).withNano(0));

        campaign = campaignRepository.save(campaign);   // cần id để join consent

        List<String> grades = req.getTargetGrade();
        List<StudentEntity> students =
                studentRepository.findByGradesWithUserAndParent(grades);

        Set<Long> emailedParents = new HashSet<>();

        for (StudentEntity s : students) {


            HealthCheckConsentEntity consent = HealthCheckConsentEntity.builder()
                    .healthCheckCampaign(campaign)
                    .student(s)
                    .parent(s.getParent())
                    .consentStatus(MedicalStatus.PENDING)
                    .academicYear(getCurrentAcademicYear())
                    .build();
            healthCheckConsentRepository.save(consent);

            Long parentId = s.getParent().getUserId();
            if (emailedParents.add(parentId)) {

                sendMailService.sendConsentRequestEmail(
                        s.getParent().getEmail(),
                        s.getParent().getFullname(),
                        s.getUser().getFullname(),
                        campaign.getName(),
                        req.getStartDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                        req.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                        req.getLocation()
                );

                notificationService.push(
                        creator.getUserId(),
                        parentId,
                        "Yêu cầu đồng ý khám sức khỏe",
                        "Vui lòng xác nhận chiến dịch " + campaign.getName()
                );
            }
        }
        return HealthCheckCampaignMapper.toDTO(campaign);
    }

    @Override
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

        HealthCheckCampaignEntity updated = campaignRepository.save(campaign);

        List<StudentEntity> students = studentRepository.findByClassEntity_GradeWithUserAndParent(updated.getTargetGrade());
        Set<Long> notifiedParents = new HashSet<>();
        for (StudentEntity student : students) {
            Long parentId = student.getParent().getUserId();
            if (notifiedParents.add(parentId)) {
                notificationService.push(
                        getCurrentUserId(), parentId,
                        "Cập nhật chiến dịch kiểm tra sức khỏe",
                        "Chiến dịch \"" + updated.getName() + "\" của khối " + updated.getTargetGrade() + " đã thay đổi."
                );
            }
        }

        return HealthCheckCampaignMapper.toDTO(updated);
    }

    @Override
    public void startCampaign(Long campaignId) {
        HealthCheckCampaignEntity c = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found"));
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
        campaignRepository.save(campaign);
    }
    @Override
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

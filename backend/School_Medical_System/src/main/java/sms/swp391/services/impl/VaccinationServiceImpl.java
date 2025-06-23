package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.CampaignStatus;
import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.respones.*;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.AuthFailedException;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.NotificationService;
import sms.swp391.services.VaccinationService;
import sms.swp391.utils.VaccinationCampaignMapper;
import sms.swp391.utils.VaccinationConsentMapper;
import sms.swp391.utils.VaccinationRecordMapper;

import java.time.Instant;
import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VaccinationServiceImpl implements VaccinationService {

    private final VaccinationCampaignRepository campaignRepository;
    private final VaccinationConsentRepository consentRepository;
    private final VaccinationRecordRepository recordRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // Campaign Methods
    @Override
    @Transactional
    public VaccinationCampaignResponse createCampaign(VaccinationCampaignRequestDTO request, Long createdById) {
        UserEntity creator = userRepository.findById(createdById)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + createdById));

        VaccinationCampaignEntity campaign = VaccinationCampaignMapper.fromRequestDTO(request);
        campaign.setCreatedBy(creator);
        campaign.setCreatedAt(Instant.now());
        campaign.setStatus(CampaignStatus.PLANNING.name());

        return VaccinationCampaignMapper.toDTO(campaignRepository.save(campaign));
    }

    @Override
    @Transactional
    public VaccinationCampaignResponse updateCampaign(Long id, VaccinationCampaignRequestDTO request) {
        VaccinationCampaignEntity campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));

        VaccinationCampaignEntity updatedCampaign = VaccinationCampaignMapper.fromRequestDTO(request);
        updatedCampaign.setId(campaign.getId());
        updatedCampaign.setCreatedBy(campaign.getCreatedBy());
        updatedCampaign.setCreatedAt(campaign.getCreatedAt());
        updatedCampaign.setStatus(campaign.getStatus());

        return VaccinationCampaignMapper.toDTO(campaignRepository.save(updatedCampaign));
    }

    @Override
    @Transactional
    public void startCampaign(Long campaignId) {
        VaccinationCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));

        campaign.setStatus(CampaignStatus.IN_PROGRESS.name());
        campaignRepository.save(campaign);

        List<StudentEntity> students = studentRepository.findByClassEntity_GradeWithUserAndParent(campaign.getTargetGrade());

        students.forEach(student -> {
            VaccinationConsentEntity consent = VaccinationConsentEntity.builder()
                    .vaccinationCampaign(campaign)
                    .student(student)
                    .parent(student.getParent())
                    .consentStatus("PENDING")
                    .academicYear(getCurrentAcademicYear())
                    .build();

            consentRepository.save(consent);

            notificationService.createNotification(
                    new NotificationCreateDTO(
                            "Vaccination Consent Request",
                            "Please consent for " + student.getUser().getFullname() +
                                    "'s vaccination on " + campaign.getStartDate(), campaign.getCreatedBy().getUserId()
                    )
            );
        });
    }

    @Override
    public VaccinationCampaignResponse getCampaignById(Long id) {
        return campaignRepository.findById(id)
                .map(VaccinationCampaignMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));
    }

    @Override
    public List<VaccinationCampaignResponse> getAllCampaigns() {
        return campaignRepository.findAll().stream()
                .map(VaccinationCampaignMapper::toDTO)
                .toList();
    }

    // Consent Methods
    @Override
    @Transactional
    public VaccinationConsentResponse updateConsent(Long consentId, VaccinationConsentRequestDTO request, Long parentId) {
        VaccinationConsentEntity consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new NotFoundException("Consent not found with id: " + consentId));

        if (!consent.getParent().getUserId().equals(parentId)) {
            throw new AuthFailedException("Only the parent can update this consent");
        }

        VaccinationConsentEntity updatedConsent = VaccinationConsentMapper.fromRequestDTO(request);
        consent.setNotes(updatedConsent.getNotes());
        consent.setConsentFormUrl(updatedConsent.getConsentFormUrl());
        consent.setResponseDate(Instant.now());

        return VaccinationConsentMapper.toDTO(consentRepository.save(consent));
    }

    @Override
    public List<VaccinationConsentResponse> getConsentsByCampaign(Long campaignId) {
        return consentRepository.findByVaccinationCampaignIdAndConsentStatus(campaignId, "PENDING").stream()
                .map(VaccinationConsentMapper::toDTO)
                .toList();
    }

    @Override
    public VaccinationConsentResponse getConsentById(Long consentId) {
        return consentRepository.findById(consentId)
                .map(VaccinationConsentMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Consent not found with id: " + consentId));
    }

    @Override
    public List<VaccinationConsentResponse> getPendingConsentsByParent(Long parentId) {
        return consentRepository.findByParentAndStatus(parentId, "PENDING").stream()
                .map(VaccinationConsentMapper::toDTO)
                .toList();
    }

    // Record Methods
    @Override
    @Transactional
    public VaccinationRecordResponse saveRecord(VaccinationRecordRequestDTO request, Long administeredById) {
        UserEntity administeredBy = userRepository.findById(administeredById)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + administeredById));

        StudentEntity student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found with id: " + request.getStudentId()));

        consentRepository.findByVaccinationCampaignIdAndStudentId(request.getCampaignId(), request.getStudentId())
                .filter(c -> "APPROVED".equals(c.getConsentStatus()))
                .orElseThrow(() -> BusinessException.builder()
                        .message("Consent not approved for this student")
                        .build());

        VaccinationRecordEntity record = VaccinationRecordMapper.fromRequestDTO(request);
        record.setVaccinationCampaign(campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + request.getCampaignId())));
        record.setStudent(student);
        record.setAdministeredBy(administeredBy);
        record.setAdministrationDate(Instant.now());
        record.setAcademicYear(getCurrentAcademicYear());

        VaccinationRecordEntity savedRecord = recordRepository.save(record);

        if (Boolean.TRUE.equals(savedRecord.getFollowUpRequired())) {
            notificationService.createNotification(
                    new NotificationCreateDTO(
                            "Vaccination Follow-up Required",
                            "Please review the vaccination record for " + student.getUser().getFullname(), administeredById
                    )
            );
        }
        return VaccinationRecordMapper.toDTO(savedRecord);
    }

    @Override
    public VaccinationRecordResponse getRecordById(Long recordId) {
        return recordRepository.findById(recordId)
                .map(VaccinationRecordMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Record not found with id: " + recordId));
    }

    @Override
    public List<VaccinationRecordResponse> getRecordsByCampaign(Long campaignId) {
        return recordRepository.findByVaccinationCampaignIdAndFollowUpRequired(campaignId, null).stream()
                .map(VaccinationRecordMapper::toDTO)
                .toList();
    }

    @Override
    public List<VaccinationRecordResponse> getRecordsByStudent(Long studentId) {
        return recordRepository.findByStudentId(studentId).stream()
                .map(VaccinationRecordMapper::toDTO)
                .toList();
    }

    @Override
    public List<VaccinationRecordResponse> getRecordsRequiringFollowUp() {
        return recordRepository.findByFollowUpRequired(true).stream()
                .map(VaccinationRecordMapper::toDTO)
                .toList();
    }

    // Utility
    private String getCurrentAcademicYear() {
        int year = Year.now().getValue();
        return year + "-" + (year + 1);
    }
}
package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.CampaignStatus;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.respones.*;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.AuthFailedException;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.SendMailService;
import sms.swp391.services.VaccinationService;
import sms.swp391.utils.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class VaccinationServiceImpl implements VaccinationService {

    private final VaccinationCampaignRepository campaignRepository;
    private final VaccinationConsentRepository consentRepository;
    private final VaccinationRecordRepository recordRepository;
    private final HealthConsultationScheduleRepository consultationScheduleRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final SendMailService sendMailService;

    // Campaign Methods
    public void endCampaign(Long campaignId) {
        VaccinationCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));

        campaign.setStatus("CLOSE");
        campaignRepository.save(campaign);
    }

    @Override
    public VaccinationCampaignResponse createCampaign(VaccinationCampaignRequestDTO request, Long createdById) {
        UserEntity creator = userRepository.findById(createdById)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + createdById));

        VaccinationCampaignEntity campaign = VaccinationCampaignMapper.fromRequestDTO(request);
        campaign.setCreatedBy(creator);
        campaign.setCreatedAt(LocalDate.now());
        campaign.setStatus("PENDING");

        VaccinationCampaignEntity savedCampaign = campaignRepository.save(campaign);
        return VaccinationCampaignMapper.toDTO(campaignRepository.save(campaign));
    }

    @Override
    public VaccinationCampaignResponse updateCampaign(Long id, VaccinationCampaignRequestDTO request) {
        VaccinationCampaignEntity campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));

        campaign.setName(request.getName());
        campaign.setDescription(request.getDescription());
        campaign.setEndDate(request.getEndDate());
        campaign.setStartDate(request.getStartDate());
        campaign.setTargetGrade(request.getTargetGrade());
        campaign.setTargetGrade(request.getTargetGrade());
        campaign.setNotes(request.getNotes());
        campaign.setVaccineType(request.getVaccineType());

        VaccinationCampaignEntity updatedCampaign = campaignRepository.save(campaign);
        return VaccinationCampaignMapper.toDTO(updatedCampaign);
    }

    @Override
    public void startCampaign(Long campaignId) {
        VaccinationCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));

        List<StudentEntity> targetStudents = studentRepository.findByClassEntity_GradeWithUserAndParent(campaign.getTargetGrade());

        for (StudentEntity student : targetStudents) {
            VaccinationConsentEntity consent = VaccinationConsentEntity.builder()
                    .vaccinationCampaign(campaign)
                    .student(student)
                    .parent(student.getParent())
                    .consentStatus("PENDING")
                    .academicYear(getCurrentAcademicYear())
                    .build();

            consentRepository.save(consent);

            sendMailService.sendConsentRequestEmail(
                    student.getParent().getEmail(),
                    student.getParent().getFullname(),
                    student.getUser().getFullname(),
                    campaign.getName(),
                    campaign.getStartDate().toString(),
                    campaign.getVaccineType()
            );
        }
        campaign.setStatus("ACTIVE");
        campaignRepository.save(campaign);
    }
/// ///
    @Override
    public VaccinationCampaignResponse getCampaignById(Long id) {
        VaccinationCampaignEntity campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));
        return VaccinationCampaignMapper.toDTO(campaign);
    }

    @Override
    public List<VaccinationCampaignResponse> getAllCampaigns() {
        List<VaccinationCampaignEntity> campaigns = campaignRepository.findAll();
        return campaigns.stream()
                .map(VaccinationCampaignMapper::toDTO)
                .toList();
    }

    @Override
    public List<VaccinationCampaignResponse> getAllCampaignsStart() {
        List<VaccinationCampaignEntity> campaigns = campaignRepository.getAllByVaccinationCampaign();
        return campaigns.stream()
                .map(VaccinationCampaignMapper::toDTO)
                .toList();
    }

    // Consent Methods
    @Override
    public VaccinationConsentResponse updateConsent(Long consentId, VaccinationConsentRequestDTO request, Long parentId) {
        VaccinationConsentEntity consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new NotFoundException("Consent not found with id: " + consentId));

        if (!consent.getParent().getUserId().equals(parentId)) {
            throw new AuthFailedException("Only the parent can update this consent");
        }

        consent.setConsentStatus(request.getConsentStatus());
        consent.setResponseDate(LocalDate.now());

        VaccinationConsentEntity updatedConsent = consentRepository.save(consent);
        return VaccinationConsentMapper.toDTO(updatedConsent);
    }

    @Override
    public List<VaccinationConsentResponse> getConsentsByCampaign(Long campaignId) {
        List<VaccinationConsentEntity> consents = consentRepository.findByVaccinationCampaignId(campaignId);
        return consents.stream()
                .map(VaccinationConsentMapper::toDTO)
                .toList();
    }

    @Override
    public VaccinationConsentResponse getConsentById(Long id) {
        VaccinationConsentEntity consent = consentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Consent not found with id: " + id));
        return VaccinationConsentMapper.toDTO(consent);
    }

    @Override
    public List<VaccinationConsentResponse> getPendingConsentsByParent(Long parentId) {
        List<VaccinationConsentEntity> consents = consentRepository.findByParent_UserIdAndConsentStatus(parentId, "PENDING");
        return consents.stream()
                .map(VaccinationConsentMapper::toDTO)
                .toList();
    }

    @Override
    public List<VaccinationConsentResponse> getPendingConsentsApprovedByParent(Long parentId) {
        List<VaccinationConsentEntity> consents = consentRepository.findByParent_UserIdAndConsentStatus(parentId, "APPROVED");
        return consents.stream()
                .map(VaccinationConsentMapper::toDTO)
                .toList();
    }

    // Record Methods

    @Override
    public VaccinationRecordResponse saveRecord(VaccinationRecordRequestDTO request, Long administeredById) {
        // Lấy chiến dịch
        VaccinationCampaignEntity campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new NotFoundException("Campaign not found"));

        // Lấy học sinh
        StudentEntity student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found"));

        // Lấy người kiểm tra
        UserEntity checker = userRepository.findById(administeredById)
                .orElseThrow(() -> new NotFoundException("Checker not found"));

        // Kiểm tra consent
        VaccinationConsentEntity consent = consentRepository.findByVaccinationCampaignIdAndStudent(campaign.getId(), student);
        if (consent == null || !consent.getConsentStatus().equals("APPROVED")) {
            throw new BusinessException("Parent consent not approved for this examination");
        }

        // Tạo kết quả
        VaccinationRecordEntity result = VaccinationRecordMapper.fromRequestDTO(request);
        result.setVaccinationCampaign(campaign);
        result.setStudent(student);
        result.setAdministeredBy(checker);
        result.setAdministrationDate(LocalDate.now());
        result.setAcademicYear(getCurrentAcademicYear());

        // Lưu kết quả
        VaccinationRecordEntity savedResult = recordRepository.save(result);
        return VaccinationRecordMapper.toDTO(savedResult);
    }

    @Override
    public VaccinationRecordResponse getRecordById(Long id) {
        VaccinationRecordEntity record = recordRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Record not found with id: " + id));
        return VaccinationRecordMapper.toDTO(record);
    }

    @Override
    public List<VaccinationRecordResponse> getRecordsByCampaign(Long campaignId) {
        List<VaccinationRecordEntity> records = recordRepository.findByVaccinationCampaign_Id(campaignId);
        return records.stream()
                .map(VaccinationRecordMapper::toDTO)
                .toList();
    }

    @Override
    public List<VaccinationRecordResponse> getRecordsByStudent(Long studentId) {
        List<VaccinationRecordEntity> records = recordRepository.findByStudentId(studentId);
        if (records.isEmpty()) throw  new NotFoundException("Result not found with id: " + studentId);
        return records.stream()
                .map(VaccinationRecordMapper::toDTO)
                .toList();
    }



    // Utility
    private String getCurrentAcademicYear() {
        int year = Year.now().getValue();
        return year + "-" + (year + 1);
    }
}
package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.HealthCheckConsentRequestDTO;
import sms.swp391.models.dtos.responses.HealthCheckConsentResponse;
import sms.swp391.models.dtos.responses.PaginatedHealthCheckConsentResponse;
import sms.swp391.models.entities.HealthCheckConsentEntity;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.HealthCheckConsentRepository;
import sms.swp391.services.HealthCheckConsentService;
import sms.swp391.utils.HealthCheckConsentMapper;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
    public class HealthCheckConsentServiceImpl implements HealthCheckConsentService {

    private final HealthCheckConsentRepository consentRepository;

    @Override
    public HealthCheckConsentResponse updateConsent(Long consentId, HealthCheckConsentRequestDTO request, Long parentId) {
        HealthCheckConsentEntity consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new NotFoundException("Consent not found"));

        if (!consent.getParent().getUserId().equals(parentId)) {
            throw new BusinessException("Parent not authorized to update this consent");
        }

        consent.setConsentStatus(request.getStatus());
        consent.setResponseDate(LocalDate.now());

        return HealthCheckConsentMapper.toDTO(consentRepository.save(consent));
    }

    @Override
    public HealthCheckConsentResponse getConsentById(Long id) {
        return consentRepository.findById(id)
                .map(HealthCheckConsentMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Consent not found"));
    }

    @Override
    public List<HealthCheckConsentResponse> getConsentsByCampaign(Long campaignId) {
        return consentRepository.findByHealthCheckCampaignId(campaignId).stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();
    }

    @Override
    public List<HealthCheckConsentResponse> getPendingConsentsByParent(Long parentId) {
        return consentRepository.findByParent_UserIdAndConsentStatus(parentId, MedicalStatus.PENDING).stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();
    }

    @Override
    public List<HealthCheckConsentResponse> getPendingConsentsApprovedByParent(Long parentId) {
        return consentRepository.findByParent_UserIdAndConsentStatus(parentId, MedicalStatus.APPROVED).stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();
    }

    @Override
    public PaginatedHealthCheckConsentResponse getAllHealthCheckConsents(String search, Pageable pageable) {
        Sort validatedSort = pageable.getSort().stream()
                .filter(order -> List.of("id", "student.user.fullname", "healthCheckCampaign.name")
                        .contains(order.getProperty()))
                .collect(Collectors.collectingAndThen(Collectors.toList(), Sort::by));

        Pageable validatedPageable = PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), validatedSort);

        Page<HealthCheckConsentEntity> consentPage =
                (search != null && !search.isBlank())
                        ? consentRepository.searchHealthCheckConsents(search, validatedPageable)
                        : consentRepository.findAll(validatedPageable);

        List<HealthCheckConsentResponse> items = consentPage.stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();

        return PaginatedHealthCheckConsentResponse.builder()
                .healthCheckConsents(items)
                .totalElements(consentPage.getTotalElements())
                .totalPages(consentPage.getTotalPages())
                .currentPage(consentPage.getNumber())
                .build();
    }

    @Override
    public PaginatedHealthCheckConsentResponse getApprovedConsentsByCampaign(Long campaignId, Pageable pageable) {
        Sort validatedSort = pageable.getSort().stream()
                .filter(order -> List.of("parent.userId", "student.id").contains(order.getProperty()))
                .collect(Collectors.collectingAndThen(Collectors.toList(), Sort::by));

        Pageable validatedPageable = PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), validatedSort);

        Page<HealthCheckConsentEntity> page =
                consentRepository.findApprovedConsentsByCampaignId(campaignId, validatedPageable);

        List<HealthCheckConsentResponse> items = page.stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();

        return PaginatedHealthCheckConsentResponse.builder()
                .healthCheckConsents(items)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .currentPage(page.getNumber())
                .build();
    }
}

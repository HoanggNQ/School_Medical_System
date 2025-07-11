package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.VaccinationConsentRequestDTO;
import sms.swp391.models.dtos.responses.VaccinationConsentResponse;
import sms.swp391.models.entities.VaccinationConsentEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.UserEntity;

import java.util.Optional;

@RequiredArgsConstructor
public class VaccinationConsentMapper {
    public static VaccinationConsentResponse toDTO(VaccinationConsentEntity entity) {
        if (entity == null) return null;

        return VaccinationConsentResponse.builder()
                .id(entity.getId())
                .campaignId(entity.getVaccinationCampaign().getId())
                .campaignName(entity.getVaccinationCampaign().getName())
                .studentId(entity.getStudent().getId())
                .studentName(Optional.ofNullable(entity.getStudent()).map(StudentEntity::getUser).map(UserEntity::getFullname).orElse(null))
                .parentId(entity.getParent().getUserId())
                .parentEmail(entity.getParent().getUsername())
                .notes(entity.getNotes())
                .responseDate(entity.getResponseDate())
                .academicYear(entity.getAcademicYear())
                .consentStatus(entity.getConsentStatus())
                .build();
    }

}
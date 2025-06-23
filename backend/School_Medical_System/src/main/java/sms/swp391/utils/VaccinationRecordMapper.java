package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.VaccinationRecordRequestDTO;
import sms.swp391.models.dtos.respones.VaccinationRecordResponse;
import sms.swp391.models.entities.VaccinationRecordEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.UserEntity;

import java.util.Optional;

@RequiredArgsConstructor
public class VaccinationRecordMapper {
    public static VaccinationRecordResponse toDTO(VaccinationRecordEntity entity) {
        if (entity == null) return null;

        return VaccinationRecordResponse.builder()
                .id(entity.getId())
                .campaignId(entity.getVaccinationCampaign().getId())
                .studentId(entity.getStudent().getId())
                .studentName(Optional.ofNullable(entity.getStudent()).map(StudentEntity::getUser).map(UserEntity::getFullname).orElse(null))
                .administrationById(entity.getAdministeredBy().getUserId())
                .administrationByName(entity.getAdministeredBy().getFullname())
                .administrationDate(entity.getAdministrationDate())
                .academicYear(entity.getAcademicYear())
                .expirationDate(entity.getExpirationDate())
                .followUpRequired(entity.getFollowUpRequired())
                .nextDoseDate(entity.getNextDoseDate())
                .injectionSite(entity.getInjectionSite())
                .lotNumber(entity.getLotNumber())
                .vaccineBatch(entity.getVaccineBatch())
                .vaccineName(entity.getVaccineName())
                .followUpNotes(entity.getFollowUpNotes())
                .reactionNotes(entity.getReactionNotes())
                .build();
    }

    public static VaccinationRecordEntity fromRequestDTO(VaccinationRecordRequestDTO dto) {
        if (dto == null) return null;

        VaccinationRecordEntity entity = new VaccinationRecordEntity();
        entity.setExpirationDate(dto.getExpirationDate());
        entity.setFollowUpRequired(dto.getFollowUpRequired());
        entity.setNextDoseDate(dto.getNextDoseDate());
        entity.setInjectionSite(dto.getInjectionSite());
        entity.setLotNumber(dto.getLotNumber());
        entity.setVaccineBatch(dto.getVaccineBatch());
        entity.setVaccineName(dto.getVaccineName());
        entity.setFollowUpNotes(dto.getFollowUpNotes());
        entity.setReactionNotes(dto.getReactionNotes());
        return entity;
    }
}
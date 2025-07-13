package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.VaccinationRecordRequestDTO;
import sms.swp391.models.dtos.responses.VaccinationRecordResponse;
import sms.swp391.models.entities.VaccinationRecordEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.UserEntity;

import java.util.Optional;

@RequiredArgsConstructor
public class VaccinationRecordMapper {

    public static VaccinationRecordResponse toDTO(VaccinationRecordEntity e) {
        return VaccinationRecordResponse.builder()
                .id(e.getId())
                .campaignId(e.getVaccinationCampaign().getId())
                .studentId(e.getStudent().getId())
                .studentName(Optional.ofNullable(e.getStudent().getUser()).map(UserEntity::getFullname).orElse(null))
                .administrationById(e.getAdministeredBy().getUserId())
                .administrationByName(e.getAdministeredBy().getFullname())
                .administrationDate(e.getAdministrationDate())
                .academicYear(e.getAcademicYear())
                .injectionSite(e.getInjectionSite())
                .vaccineName(e.getVaccineName())
                .followUpNotes(e.getFollowUpNotes())
                .reactionNotes(e.getReactionNotes())
                .build();
    }

    public static VaccinationRecordEntity fromRequestDTO(VaccinationRecordRequestDTO dto) {
        if (dto == null) return null;

        return VaccinationRecordEntity.builder()
                .vaccineName(dto.getVaccineName())
                .injectionSite(dto.getInjectionSite())
                .followUpNotes(dto.getFollowUpNotes())
                .reactionNotes(dto.getReactionNotes())
                .build();
    }
}
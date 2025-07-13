package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.MedicationRequestCreateDTO;
import sms.swp391.models.dtos.requests.MedicationRequestDetailDTO;
import sms.swp391.models.dtos.responses.MedicationRequestDetailResponseDTO;
import sms.swp391.models.dtos.responses.MedicationRequestResponseDTO;
import sms.swp391.models.entities.*;

import java.time.LocalDate;
import java.util.Collections;

@RequiredArgsConstructor
public class MedicationRequestMapper {

    public static MedicationRequestEntity toEntity(MedicationRequestCreateDTO dto, UserEntity parent, StudentEntity student, String academicYear) {
        return MedicationRequestEntity.builder()
                .student(student)
                .requestedBy(parent)
                .requestDate(LocalDate.now())
                .academicYear(academicYear)
                .status(MedicalStatus.PENDING)
                .notes(dto.getNotes())
                .build();
    }

    public static MedicationRequestDetailEntity toDetailEntity(MedicationRequestDetailDTO dto, MedicationRequestEntity request, MedicationEntity medication) {
        return MedicationRequestDetailEntity.builder()
                .request(request)
                .medication(medication)
                .dosage(dto.getDosage())
                .frequency(dto.getFrequency())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .quantity(dto.getQuantity())
                .providedByParent(dto.getProvidedByParent())
                .build();
    }

    public static MedicationRequestResponseDTO toResponseDTO(MedicationRequestEntity entity) {
        return MedicationRequestResponseDTO.builder()
                .id(entity.getId())
                .studentId(entity.getStudent().getId())
                .studentName(entity.getStudent().getUser().getFullname())
                .academicYear(entity.getAcademicYear())
                .status(entity.getStatus())
                .notes(entity.getNotes())
                .requestDate(entity.getRequestDate())
                .details(
                        entity.getMedicationRequestDetails() != null
                                ? entity.getMedicationRequestDetails().stream()
                                .map(MedicationRequestMapper::toDetailResponseDTO)
                                .toList()
                                : Collections.emptyList()
                )
                .build();
    }


    public static MedicationRequestDetailResponseDTO toDetailResponseDTO(MedicationRequestDetailEntity detail) {
        return MedicationRequestDetailResponseDTO.builder()
                .medicationId(detail.getMedication().getId())
                .medicationName(detail.getMedication().getMedicationName())
                .dosage(detail.getDosage())
                .frequency(detail.getFrequency())
                .startDate(detail.getStartDate())
                .endDate(detail.getEndDate())
                .quantity(detail.getQuantity())
                .providedByParent(detail.getProvidedByParent())
                .build();
    }

}

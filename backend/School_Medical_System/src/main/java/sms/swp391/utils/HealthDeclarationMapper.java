package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.HealthDeclarationCreateDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationUpdateDTO;
import sms.swp391.models.dtos.respones.HealthDeclarationResponseDTO;
import sms.swp391.models.entities.*;

import java.time.Instant;
@RequiredArgsConstructor
public class HealthDeclarationMapper {

    public static HealthDeclarationResponseDTO toDTO(HealthDeclarationEntity entity) {
        if (entity == null) return null;

        return HealthDeclarationResponseDTO.builder()
                .id(entity.getId())
                .studentId(entity.getStudent().getId())
                .declaredById(entity.getDeclaredBy().getUserId())
                .studentName(entity.getStudent().getUser().getFullname())
                .declaredByName(entity.getDeclaredBy().getFullname())
                .declarationDate(entity.getDeclarationDate())
                .status(entity.getStatus())
                .academicYear(entity.getAcademicYear())
                .height(entity.getStudent().getHeight())
                .weight(entity.getStudent().getWeight())
                .bloodType(entity.getStudent().getBloodType())
                .allergies(entity.getStudent().getAllergies())
                .chronicDiseases(entity.getStudent().getChronicDiseases())
                .currentMedications(entity.getStudent().getCurrentMedications())
                .emergencyContactName(entity.getStudent().getEmergencyContactName())
                .emergencyContactPhone(entity.getStudent().getEmergencyContactPhone())
                .build();
    }

    public static HealthDeclarationEntity fromCreateDTO(HealthDeclarationCreateDTO dto,
                                                        StudentEntity student,
                                                        UserEntity declaredBy) {
        if (dto == null) return null;

        HealthDeclarationEntity entity = HealthDeclarationEntity.builder()
                .student(student)
                .declaredBy(declaredBy)
                .status(dto.getStatus())
                .academicYear(dto.getAcademicYear())
                .declarationDate(Instant.now())
                .build();

        // Update student health information
        updateStudentHealthInfo(student, dto);

        return entity;
    }

    public static void updateEntityFromCreateDTO(HealthDeclarationEntity entity, HealthDeclarationCreateDTO dto) {
        if (entity == null || dto == null) return;

        entity.setStatus(dto.getStatus());
        entity.setAcademicYear(dto.getAcademicYear());

        // Update student health information
        if (entity.getStudent() != null) {
            updateStudentHealthInfo(entity.getStudent(), dto);
        }
    }

    public static void updateEntityFromUpdateDTO(HealthDeclarationEntity entity, HealthDeclarationUpdateDTO dto) {
        if (entity == null || dto == null) return;

        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
        if (dto.getAcademicYear() != null) {
            entity.setAcademicYear(dto.getAcademicYear());
        }

        // Update student health information if provided
        if (entity.getStudent() != null) {
            updateStudentHealthInfoFromUpdateDTO(entity.getStudent(), dto);
        }
    }

    private static void updateStudentHealthInfo(StudentEntity student, HealthDeclarationCreateDTO dto) {
        if (dto.getWeight() != null) {
            student.setWeight(dto.getWeight());
        }
        if (dto.getHeight() != null) {
            student.setHeight(dto.getHeight());
        }
        if (dto.getBloodType() != null) {
            student.setBloodType(dto.getBloodType());
        }
        if (dto.getAllergies() != null) {
            student.setAllergies(dto.getAllergies());
        }
        if (dto.getChronicDiseases() != null) {
            student.setChronicDiseases(dto.getChronicDiseases());
        }
        if (dto.getCurrentMedications() != null) {
            student.setCurrentMedications(dto.getCurrentMedications());
        }
        if (dto.getEmergencyContactName() != null) {
            student.setEmergencyContactName(dto.getEmergencyContactName());
        }
        if (dto.getEmergencyContactPhone() != null) {
            student.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        }
    }

    private static void updateStudentHealthInfoFromUpdateDTO(StudentEntity student, HealthDeclarationUpdateDTO dto) {
        if (dto.getWeight() != null) {
            student.setWeight(dto.getWeight());
        }
        if (dto.getHeight() != null) {
            student.setHeight(dto.getHeight());
        }
        if (dto.getBloodType() != null) {
            student.setBloodType(dto.getBloodType());
        }
        if (dto.getAllergies() != null) {
            student.setAllergies(dto.getAllergies());
        }
        if (dto.getChronicDiseases() != null) {
            student.setChronicDiseases(dto.getChronicDiseases());
        }
        if (dto.getCurrentMedications() != null) {
            student.setCurrentMedications(dto.getCurrentMedications());
        }
        if (dto.getEmergencyContactName() != null) {
            student.setEmergencyContactName(dto.getEmergencyContactName());
        }
        if (dto.getEmergencyContactPhone() != null) {
            student.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        }
    }
}
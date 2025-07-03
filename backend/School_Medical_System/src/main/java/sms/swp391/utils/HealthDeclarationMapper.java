package sms.swp391.utils;

import sms.swp391.models.dtos.requests.HealthDeclarationCreateDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationUpdateDTO;
import sms.swp391.models.dtos.responses.HealthDeclarationResponseDTO;
import sms.swp391.models.dtos.responses.StudentHealthProfileResponseDTO;
import sms.swp391.models.entities.*;

import java.time.LocalDate;

public class HealthDeclarationMapper {
    public static StudentHealthProfileResponseDTO toDTOProfile(StudentHealthProfileEntity entity) {
        if (entity == null) return null;
        StudentHealthProfileResponseDTO dto = new StudentHealthProfileResponseDTO();
        dto.setStudentId(entity.getStudent().getHealthProfile().getStudentId());
        dto.setHeightCm(entity.getHeight());
        dto.setWeightKg(entity.getWeight());
        dto.setBmi(entity.getBmi());
        dto.setVisionLeft(entity.getVisionLeft());
        dto.setVisionRight(entity.getVisionRight());
        dto.setHearing(entity.getHearing());
        dto.setDentalHealth(entity.getDentalHealth());
        dto.setBloodPressure(entity.getBloodPressure());
        dto.setPulse(entity.getPulse());
        dto.setTemperature(entity.getTemperature());
        dto.setBloodType(entity.getBloodType());
        dto.setGeneticDiseases(entity.getGeneticDiseases());
        dto.setAllergies(entity.getAllergies());
        dto.setChronicDiseases(entity.getChronicDiseases());
        return dto;
    }
    public static HealthDeclarationResponseDTO toDTO(HealthDeclarationEntity entity) {
        if (entity == null) return null;

        StudentEntity student = entity.getStudent();
        StudentHealthProfileEntity profile = student.getHealthProfile();

        return HealthDeclarationResponseDTO.builder()
                .id(entity.getId())
                .studentId(student.getId())
                .declaredById(entity.getDeclaredBy().getUserId())
                .studentName(student.getUser().getFullname())
                .declaredByName(entity.getDeclaredBy().getFullname())
                .declarationDate(entity.getDeclarationDate())
                .status(entity.getStatus())
                .academicYear(entity.getAcademicYear())
                .height(profile != null ? profile.getHeight() : null)
                .weight(profile != null ? profile.getWeight() : null)
                .bloodType(profile != null ? profile.getBloodType() : null)
                .allergies(profile != null ? profile.getAllergies() : null)
                .chronicDiseases(profile != null ? profile.getChronicDiseases() : null)
                .build();
    }

    public static HealthDeclarationEntity fromCreateDTO(HealthDeclarationCreateDTO dto,
                                                        StudentEntity student,
                                                        UserEntity declaredBy) {
        if (dto == null) return null;

        updateStudentHealthInfo(student, dto);

        return HealthDeclarationEntity.builder()
                .student(student)
                .declaredBy(declaredBy)
                .academicYear(dto.getAcademicYear())
                .declarationDate(LocalDate.now())
                .build();
    }

    public static void updateEntityFromCreateDTO(HealthDeclarationEntity entity,
                                                 HealthDeclarationCreateDTO dto) {
        if (entity == null || dto == null) return;

        entity.setAcademicYear(dto.getAcademicYear());
        updateStudentHealthInfo(entity.getStudent(), dto);
    }

    public static void updateEntityFromUpdateDTO(HealthDeclarationEntity entity,
                                                 HealthDeclarationUpdateDTO dto) {
        if (entity == null || dto == null) return;

        if (dto.getStatus() != null) entity.setStatus(dto.getStatus());
        if (dto.getAcademicYear() != null) entity.setAcademicYear(dto.getAcademicYear());

        updateStudentHealthInfoFromUpdateDTO(entity.getStudent(), dto);
    }

    private static void updateStudentHealthInfo(StudentEntity student,
                                                HealthDeclarationCreateDTO dto) {
        StudentHealthProfileEntity profile = getOrCreateProfile(student);

        if (dto.getWeight() != null) profile.setWeight(dto.getWeight());
        if (dto.getHeight() != null) profile.setHeight(dto.getHeight());
        if (dto.getBloodType() != null) profile.setBloodType(dto.getBloodType());
        if (dto.getAllergies() != null) profile.setAllergies(dto.getAllergies());
        if (dto.getChronicDiseases() != null) profile.setChronicDiseases(dto.getChronicDiseases());

    }

    private static void updateStudentHealthInfoFromUpdateDTO(StudentEntity student,
                                                             HealthDeclarationUpdateDTO dto) {
        StudentHealthProfileEntity profile = getOrCreateProfile(student);

        if (dto.getWeight() != null) profile.setWeight(dto.getWeight());
        if (dto.getHeight() != null) profile.setHeight(dto.getHeight());
        if (dto.getBloodType() != null) profile.setBloodType(dto.getBloodType());
        if (dto.getAllergies() != null) profile.setAllergies(dto.getAllergies());
        if (dto.getChronicDiseases() != null) profile.setChronicDiseases(dto.getChronicDiseases());

    }

    private static StudentHealthProfileEntity getOrCreateProfile(StudentEntity student) {
        StudentHealthProfileEntity profile = student.getHealthProfile();
        if (profile == null) {
            profile = new StudentHealthProfileEntity();
            profile.setStudent(student);
            student.setHealthProfile(profile);
        }
        return profile;
    }
}

package sms.swp391.utils;

import sms.swp391.models.dtos.request.StudentRequest;
import sms.swp391.models.dtos.respones.StudentResponse;
import sms.swp391.models.entities.ClassEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.UserEntity;

public class StudentMapper {

    public static StudentResponse toDTO(StudentEntity entity) {
        if (entity == null) return null;
        return StudentResponse.builder()
                .id(entity.getId())
                .user(UserMapper.toDTO(entity.getUser()))
                .classId(entity.getClassEntity() != null ? entity.getClassEntity().getId() : null)
                .parent(UserMapper.toDTO(entity.getParent()))
                .studentCode(entity.getStudentCode())
                .bloodType(entity.getBloodType())
                .geneticDiseases(entity.getGeneticDiseases())
                .otherMedicalNotes(entity.getOtherMedicalNotes())
                .emergencyContact(entity.getEmergencyContact())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static StudentEntity fromRequest(StudentRequest request, UserEntity user, ClassEntity classEntity, UserEntity parent) {
        if (request == null) return null;
        return StudentEntity.builder()
                .user(user)
                .classEntity(classEntity)
                .parent(parent)
                .studentCode(request.getStudentCode())
                .bloodType(request.getBloodType())
                .geneticDiseases(request.getGeneticDiseases())
                .otherMedicalNotes(request.getOtherMedicalNotes())
                .emergencyContact(request.getEmergencyContact())
                .status("ACTIVE")
                .build();
    }
}
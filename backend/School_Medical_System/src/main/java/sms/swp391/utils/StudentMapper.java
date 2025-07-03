package sms.swp391.utils;

import sms.swp391.models.dtos.requests.StudentRequest;
import sms.swp391.models.dtos.responses.StudentGetResponse;
import sms.swp391.models.dtos.responses.StudentResponse;
import sms.swp391.models.entities.*;

public class StudentMapper {

    public static StudentResponse toDTO(StudentEntity entity) {
        if (entity == null) return null;

        StudentHealthProfileEntity profile = entity.getHealthProfile();

        return StudentResponse.builder()
                .id(entity.getId())
                .user(UserMapper.toDTO(entity.getUser()))
                .classId(entity.getClassEntity() != null ? entity.getClassEntity().getId() : null)
                .parent(UserMapper.toDTO(entity.getParent()))
                /* profile */
                .bloodType(profile != null ? profile.getBloodType() : null)
                .geneticDiseases(profile != null ? profile.getGeneticDiseases() : null)
                .chronicDiseases(profile != null ? profile.getChronicDiseases() : null)
                .allergies(profile != null ? profile.getAllergies() : null)
                .height(profile != null ? profile.getHeight() : null)
                .weight(profile != null ? profile.getWeight() : null)
                /* hành chính */
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }


    public static StudentGetResponse toStudentGetResponse(StudentEntity student) {
        UserEntity user = student.getUser();
        StudentHealthProfileEntity profile = student.getHealthProfile();

        return StudentGetResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullname())
                .dob(user.getDob() != null ? user.getDob().toString() : null)
                .gender(user.getGender())
                .className(student.getClassEntity() != null ? student.getClassEntity().getClassName() : null)
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .studentCode(student.getStudentCode())
                .bloodType(profile != null ? profile.getBloodType() : null)
                .geneticDiseases(profile != null ? profile.getGeneticDiseases() : null)
                .chronicDiseases(profile != null ? profile.getChronicDiseases() : null)
                .allergies(profile != null ? profile.getAllergies() : null)
                .height(profile != null ? profile.getHeight() : null)
                .weight(profile != null ? profile.getWeight() : null)
                .build();
    }
}

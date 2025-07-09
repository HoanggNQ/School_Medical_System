package sms.swp391.utils;

import sms.swp391.models.dtos.responses.StudentGetResponse;
import sms.swp391.models.dtos.responses.StudentResponse;
import sms.swp391.models.entities.*;

public class StudentMapper {

    public static StudentResponse toDTO(StudentEntity entity) {
        if (entity == null) return null;


        return StudentResponse.builder()
                .id(entity.getId())
                .user(UserMapper.toDTO(entity.getUser()))
                .classId(entity.getClassEntity() != null ? entity.getClassEntity().getId() : null)
                .className(entity.getClassEntity() != null ? entity.getClassEntity().getClassName() : null)
                .parentId(entity.getParent() != null ? entity.getParent().getUserId() : null)
                .parentName(entity.getParent() != null ? entity.getParent().getFullname() : null)
                .studentCode(entity.getStudentCode())
                .avatarUrl(entity.getUser() != null ? entity.getUser().getAvatarurl() : null)
                .build();
    }

    public static StudentGetResponse toStudentGetResponse(StudentEntity student) {
        if (student == null || student.getUser() == null) return null;

        UserEntity user = student.getUser();
        UserEntity parent = student.getParent();

        return StudentGetResponse.builder()
                .studentId(student.getId())
                .fullName(user.getFullname())
                .parentID(parent != null ? String.valueOf(parent.getUserId()) : null)
                .parentName(parent != null ? parent.getFullname() : null)
                .dob(user.getDob() != null ? user.getDob().toString() : null)
                .gender(user.getGender())
                .className(student.getClassEntity() != null ? student.getClassEntity().getClassName() : null)
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .studentCode(student.getStudentCode())
                .avatarUrl(user.getAvatarurl())
                .build();
    }
}

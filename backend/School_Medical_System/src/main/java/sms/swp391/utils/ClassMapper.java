package sms.swp391.utils;

import sms.swp391.models.dtos.respones.ClassResponse;
import sms.swp391.models.entities.ClassEntity;

public class ClassMapper {
    public static ClassResponse toDTO(ClassEntity entity) {
        if (entity == null) return null;
        return ClassResponse.builder()
                .id(entity.getId())
                .className(entity.getClassName())
                .grade(entity.getGrade())
                .totalstudent(entity.getTotalstudent())
                .build();
    }
}
package sms.swp391.services;

import sms.swp391.models.dtos.respones.ClassResponse;
import sms.swp391.models.entities.ClassEntity;

import java.util.List;

public interface ClassService {
    ClassResponse createClass(ClassEntity classEntity);
    ClassResponse updateClass(Long id, ClassEntity classEntity);
    void deleteClass(Long id);
    List<ClassResponse> getAllClasses();
    ClassResponse getClassById(Long id);
}
package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.respones.ClassResponse;
import sms.swp391.models.entities.ClassEntity;
import sms.swp391.models.exception.ActionFailedException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.ClassRepository;
import sms.swp391.services.ClassService;
import sms.swp391.utils.ClassMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepository;

    @Override
    public ClassResponse createClass(ClassEntity classEntity) {
        try {
            ClassEntity saved = classRepository.save(classEntity);
            return ClassMapper.toDTO(saved);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to create class");
        }
    }

    @Override
    public ClassResponse updateClass(Long id, ClassEntity classEntity) {
        ClassEntity existing = classRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(
                        String.format("Cannot find class with ID: %s", id)
                ));
        existing.setClassName(classEntity.getClassName());
        existing.setGrade(classEntity.getGrade());
        existing.setTotalstudent(classEntity.getTotalstudent());
        try {
            ClassEntity updated = classRepository.save(existing);
            return ClassMapper.toDTO(updated);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to update class with ID: %s", id));
        }
    }

    @Override
    public void deleteClass(Long id) {
        ClassEntity classEntity = classRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(
                        String.format("Cannot find class with ID: %s", id)
                ));
        try {
            classRepository.delete(classEntity);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to delete class with ID: %s", id));
        }
    }

    @Override
    public List<ClassResponse> getAllClasses() {
        try {
            List<ClassEntity> classes = classRepository.findAll();
            return classes.stream()
                    .map(ClassMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ActionFailedException("Failed to get classes");
        }
    }

    @Override
    public ClassResponse getClassById(Long id) {
        try {
            ClassEntity classEntity = classRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Class not found"));
            return ClassMapper.toDTO(classEntity);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to get class with ID: %s", id));
        }
    }
}
package sms.swp391.services.impl;

import jakarta.annotation.PostConstruct;
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
        if (classEntity.getTotalstudent() != 0) {
            throw new ActionFailedException("Cannot delete class with students assigned");
        }
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
            // Bỏ dòng này nếu không muốn tính toán số sinh viên active
            // classes.forEach(this::calculateActiveStudent);
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
            // Bỏ dòng này nếu không muốn tính toán số sinh viên active
            // calculateActiveStudent(classEntity);
            return ClassMapper.toDTO(classEntity);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to get class with ID: %s", id));
        }
    }


    private void calculateActiveStudent(ClassEntity classEntity) {
        if (classEntity.getStudents() != null) {
            int count = (int) classEntity.getStudents().stream()
                .filter(s -> s.getUser() != null && s.getUser().getStatus() != null && s.getUser().getStatus().name().equals("ACTIVE"))
                .count();
            classEntity.setTotalstudent(count);
        } else {
            classEntity.setTotalstudent(0);
        }
    }

    @PostConstruct
    public void updateAllClassTotalStudents() {
        List<ClassEntity> classes = classRepository.findAllWithStudentsAndUser();
        classes.forEach(this::calculateActiveStudent);
        classRepository.saveAll(classes);
    }
}
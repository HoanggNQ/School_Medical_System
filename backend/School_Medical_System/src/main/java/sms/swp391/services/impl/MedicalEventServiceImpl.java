package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.requests.MedicalEventRequestDTO;
import sms.swp391.models.dtos.responses.MedicalEventResponse;
import sms.swp391.models.entities.MedicalEventEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.MedicalEventRepository;
import sms.swp391.repositories.StudentRepository;
import sms.swp391.repositories.UserRepository;
import sms.swp391.services.MedicalEventService;
import sms.swp391.utils.MedicalEventMapper;
import sms.swp391.models.dtos.responses.PaginatedMedicalEventResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MedicalEventServiceImpl implements MedicalEventService {

    private final MedicalEventRepository medicalEventRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    public MedicalEventResponse create(MedicalEventRequestDTO request) {
        StudentEntity student = null;
        if (request.getStudentId() != null) {
            student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new NotFoundException("Student not found"));
        }
        UserEntity reporter = null;
        if (request.getReportedById() != null) {
            reporter = userRepository.findById(request.getReportedById())
                    .orElseThrow(() -> new NotFoundException("Reporter not found"));
        }
        MedicalEventEntity entity = MedicalEventMapper.toEntity(request, student, reporter);
        return MedicalEventMapper.toDTO(medicalEventRepository.save(entity));
    }

    @Override
    public MedicalEventResponse update(Long id, MedicalEventRequestDTO request) {
        MedicalEventEntity entity = medicalEventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Medical event not found"));

        entity.setEventType(request.getEventType());
        entity.setDescription(request.getDescription());
        entity.setLocation(request.getLocation());
        if (request.getEventDate() != null) {
            entity.setEventDate(java.time.LocalDate.parse(request.getEventDate()));
        }
        if (request.getStatus() != null) {
            entity.setStatus(sms.swp391.models.dtos.enums.MedicalStatus.valueOf(request.getStatus()));
        }
        entity.setFollowUpRequired(request.getFollowUpRequired());
        entity.setFollowUpNotes(request.getFollowUpNotes());

        if (request.getStudentId() != null) {
            StudentEntity student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new NotFoundException("Student not found"));
            entity.setStudent(student);
        }
        if (request.getReportedById() != null) {
            UserEntity reporter = userRepository.findById(request.getReportedById())
                    .orElseThrow(() -> new NotFoundException("Reporter not found"));
            entity.setReportedBy(reporter);
        }

        return MedicalEventMapper.toDTO(medicalEventRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        medicalEventRepository.deleteById(id);
    }

    @Override
    public MedicalEventResponse getById(Long id) {
        MedicalEventEntity entity = medicalEventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Medical event not found"));
        return MedicalEventMapper.toDTO(entity);
    }

    @Override
    public PaginatedMedicalEventResponse getAllMedicalEvents(String search, Pageable pageable) {
        Sort validatedSort = pageable.getSort().stream()
                .filter(order -> {
                    String property = order.getProperty();
                    return property.equals("eventDate") ||
                            property.equals("id") ||
                            property.equals("eventType") ||
                            property.equals("description") ||
                            property.equals("location") ||
                            property.equals("status") ||
                            "reportedBy.userId".equals(property) ||
                            "student.id".equals(property) ||
                            property.equals("followUpRequired") ||
                            property.equals("followUpNotes");
                })
                .collect(Collectors.collectingAndThen(
                        Collectors.toList(),
                        Sort::by
                ));

        Pageable validatedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                validatedSort
        );

        Page<MedicalEventEntity> medicalEventPage;
        if (search != null && !search.isEmpty()) {
            medicalEventPage = medicalEventRepository.searchMedicalEvents(search, validatedPageable);
        } else {
            medicalEventPage = medicalEventRepository.findAll(validatedPageable);
        }

        List<MedicalEventResponse> medicalEventDTOs = medicalEventPage.stream()
                .map(MedicalEventMapper::toDTO)
                .toList();

        return PaginatedMedicalEventResponse.builder()
                .medicalEvents(medicalEventDTOs)
                .totalElements(medicalEventPage.getTotalElements())
                .totalPages(medicalEventPage.getTotalPages())
                .currentPage(medicalEventPage.getNumber())
                .build();
    }
}
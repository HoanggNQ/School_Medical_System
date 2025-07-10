package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.requests.MedicalEventCreateRequestDTO;
import sms.swp391.models.dtos.requests.MedicalEventUpdateRequestDTO;
import sms.swp391.models.dtos.responses.MedicalEventResponse;
import sms.swp391.models.dtos.responses.PagedResponse;
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
import sms.swp391.utils.PageUtils;

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
    public MedicalEventResponse create(Long reportedById, MedicalEventCreateRequestDTO request) {
        StudentEntity student = null;
        if (request.getStudentId() != null) {
            student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new NotFoundException("Student not found: " + request.getStudentId()));
        }
        UserEntity reporter = null;
        if (reportedById != null) {
            reporter = userRepository.findById(reportedById)
                    .orElseThrow(() -> new NotFoundException("User not found: " + reportedById));
        }
        MedicalEventEntity entity = MedicalEventMapper.toEntity(request, student, reporter);
        return MedicalEventMapper.toDTO(medicalEventRepository.save(entity));
    }

    @Override
    public MedicalEventResponse update(Long reportedById,Long id, MedicalEventUpdateRequestDTO request) {
        MedicalEventEntity entity = medicalEventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Medical event not found"));

        if (request.getStatus() != null) {
        }
        entity.setFollowUpNotes(request.getFollowUpNotes());

        if (request.getStudentId() != null) {
            StudentEntity student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new NotFoundException("Student not found"));
            entity.setStudent(student);
        }

        return MedicalEventMapper.toDTO(medicalEventRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        MedicalEventEntity entity = medicalEventRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Medical event not found"));
        medicalEventRepository.delete(entity);
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
    @Override
    public PagedResponse<MedicalEventResponse> getAllByStudentId(Long studentId, Pageable pageable) {
        StudentEntity student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found: " + studentId));

        Pageable validatedPageable = validateSort(pageable, List.of(
                "eventDate", "id", "eventType", "description", "location", "status",
                "followUpNotes", "reportedBy.userId", "student.id"
        ));

        Page<MedicalEventEntity> medicalEventPage = medicalEventRepository.findAllByStudent(student, validatedPageable);

        Page<MedicalEventResponse> responsePage = medicalEventPage.map(MedicalEventMapper::toDTO);

        return PageUtils.toPagedResponse(responsePage);
    }
    private Pageable validateSort(Pageable pageable, List<String> allowedProperties) {
        Sort validatedSort = pageable.getSort().stream()
                .filter(order -> allowedProperties.contains(order.getProperty()))
                .collect(Collectors.collectingAndThen(Collectors.toList(), Sort::by));

        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                validatedSort
        );
    }


}
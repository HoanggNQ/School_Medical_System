package sms.swp391.services.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.requests.MedicationRequestCreateDTO;
import sms.swp391.models.dtos.requests.MedicationRequestDetailDTO;
import sms.swp391.models.dtos.responses.MedicationRequestResponseDTO;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.MedicationRequestService;
import sms.swp391.services.NotificationService;
import sms.swp391.utils.MedicationRequestMapper;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicationRequestServiceImpl implements MedicationRequestService {

    private final MedicationRequestRepository requestRepository;
    private final MedicationRequestDetailRepository detailRepository;
    private final MedicationRepository medicationRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    @Transactional
    @Override
    public List<MedicationRequestResponseDTO> getRequestsByParentId(Long parentId) {
        UserEntity parent = userRepository.findById(parentId)
                .orElseThrow(() -> new NotFoundException("Parent not found with id: " + parentId));

        List<MedicationRequestEntity> requests = requestRepository.findByRequestedBy(parent);

        return requests.stream()
                .map(MedicationRequestMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    private String generateAcademicYear() {
        int year = LocalDate.now().getYear();
        return year + "-" + (year + 1);
    }

    @Override
    @Transactional
    public MedicationRequestResponseDTO createRequest(MedicationRequestCreateDTO dto, Long parentId) {
        UserEntity parent = userRepository.findById(parentId)
                .orElseThrow(() -> new NotFoundException("Parent not found with id: " + parentId));
        return createMedicationRequest(dto, parent);
    }

    @Override
    @Transactional
    public MedicationRequestResponseDTO createMedicationRequest(MedicationRequestCreateDTO dto, UserEntity parent) {
        StudentEntity student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found"));

        MedicationRequestEntity request = MedicationRequestMapper.toEntity(dto, parent, student, generateAcademicYear());
        requestRepository.save(request);

        for (MedicationRequestDetailDTO detailDTO : dto.getMedications()) {
            MedicationEntity medication = medicationRepository.findById(detailDTO.getMedicationId())
                    .orElseThrow(() -> new NotFoundException("Medication not found"));

            if (detailDTO.getProvidedByParent() == null || !detailDTO.getProvidedByParent()) {
                if (medication.getQuantity() == null || medication.getQuantity() < detailDTO.getQuantity()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient medication in stock");
                }
                medication.setQuantity(medication.getQuantity() - detailDTO.getQuantity());
                medicationRepository.save(medication);
            }

            MedicationRequestDetailEntity detail = MedicationRequestMapper.toDetailEntity(detailDTO, request, medication);
            detailRepository.save(detail);
        }

        List<UserEntity> medicalStaff = userRepository.findByRoleName(RoleEnum.SCHOOL_NURSE);
        for (UserEntity staff : medicalStaff) {
            notificationService.push(
                    parent.getUserId(),
                    staff.getUserId(),
                    "Yêu cầu cấp phát thuốc mới",
                    "Phụ huynh của " + student.getUser().getFullname() + " đã gửi yêu cầu cấp phát thuốc."
            );
        }

        return MedicationRequestMapper.toResponseDTO(request);
    }

    @Transactional
    @Override
    public List<MedicationRequestResponseDTO> getApproveRequests() {
        return requestRepository.findByStatus(MedicalStatus.APPROVED)
                .stream()
                .map(MedicationRequestMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    @Override
    public List<MedicationRequestResponseDTO> getRejectRequests() {
        return requestRepository.findByStatus(MedicalStatus.REJECTED)
                .stream()
                .map(MedicationRequestMapper::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public List<MedicationRequestResponseDTO> getPendingRequests() {
        return requestRepository.findByStatus(MedicalStatus.PENDING)
                .stream()
                .map(MedicationRequestMapper::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public MedicationRequestResponseDTO getById(Long requestId) {
        MedicationRequestEntity entity = requestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Medication request not found with id: " + requestId));
        return MedicationRequestMapper.toResponseDTO(entity);
    }

    @Override
    @Transactional
    public void approveRequest(Long requestId, Long staffId) {
        MedicationRequestEntity request = requestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Medication request not found with id: " + requestId));
        UserEntity staff = userRepository.findById(staffId)
                .orElseThrow(() -> new NotFoundException("Staff not found with id: " + staffId));

        request.setStatus(MedicalStatus.APPROVED);
        request.setReviewedBy(staff);
        request.setReviewDate(LocalDate.now());
        requestRepository.save(request);

        notificationService.push(
                staff.getUserId(),
                request.getRequestedBy().getUserId(),
                "Yêu đã được duyệt",
                "Yêu cầu thuốc cho " + request.getStudent().getUser().getFullname() + " đã được chấp thuận."
        );
    }

    @Override
    @Transactional
    public void rejectRequest(Long requestId, Long staffId) {
        MedicationRequestEntity request = requestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Medication request not found with id: " + requestId));
        UserEntity staff = userRepository.findById(staffId)
                .orElseThrow(() -> new NotFoundException("Staff not found with id: " + staffId));

        request.setStatus(MedicalStatus.REJECTED);
        request.setReviewedBy(staff);
        request.setReviewDate(LocalDate.now());
        requestRepository.save(request);

        notificationService.push(
                staff.getUserId(),
                request.getRequestedBy().getUserId(),
                "Yêu bị từ chối",
                "Yêu uống thuốc cho " + request.getStudent().getUser().getFullname() + " đã bị từ chối."
        );
    }
    @Transactional
    @Override
    public void doneRequest(Long requestId, Long staffId) {
        MedicationRequestEntity request = requestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Medication request not found with id: " + requestId));
        UserEntity staff = userRepository.findById(staffId)
                .orElseThrow(() -> new NotFoundException("Staff not found with id: " + staffId));

        request.setStatus(MedicalStatus.DONE);
        request.setReviewedBy(staff);
        request.setReviewDate(LocalDate.now());
        requestRepository.save(request);

        notificationService.push(
                staff.getUserId(),
                request.getRequestedBy().getUserId(),
                "Yêu cầu thuốc bị từ chối",
                "Yêu cầu thuốc cho " + request.getStudent().getUser().getFullname() + " đã hoàn thành."
        );
    }

    @Override
    @Transactional
    public Page<MedicationRequestResponseDTO> getAllRequests(Pageable pageable) {
        Page<MedicationRequestEntity> page = requestRepository.findAll(pageable);
        List<MedicationRequestResponseDTO> dtoList = page.stream()
                .map(MedicationRequestMapper::toResponseDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, page.getTotalElements());
    }

}

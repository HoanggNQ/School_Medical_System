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
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
    @Override
    @Transactional
    public List<MedicationRequestResponseDTO> getRequestsByStudentId(Long studentId) {
        StudentEntity student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found with id: " + studentId));

        List<MedicationRequestEntity> requests = requestRepository.findByStudent(student);
        return requests.stream()
                .map(MedicationRequestMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void cancelRequest(Long requestId, Long requesterId) {
        MedicationRequestEntity request = requestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Medication request not found with id: " + requestId));

        if (!request.getRequestedBy().getUserId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền hủy yêu cầu này.");
        }

        if (request.getStatus() != MedicalStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ được hủy yêu cầu khi đang chờ duyệt.");
        }

        request.setStatus(MedicalStatus.DELETED);
        request.setReviewDate(LocalDate.now());
        requestRepository.save(request);
    }



    @Override
    @Transactional
    public MedicationRequestResponseDTO updateRequest(Long requestId, MedicationRequestCreateDTO dto, Long parentId) {
        MedicationRequestEntity request = requestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Medication request not found with id: " + requestId));

        if (!request.getRequestedBy().getUserId().equals(parentId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền sửa yêu cầu này.");
        }

        if (request.getStatus() != MedicalStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ được sửa yêu cầu khi đang chờ duyệt.");
        }

        StudentEntity student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found with id: " + dto.getStudentId()));
        if (!student.getParent().getUserId().equals(parentId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Học sinh không thuộc quyền quản lý của phụ huynh.");
        }

        // Hoàn lại thuốc cũ nếu do trường cấp
        List<MedicationRequestDetailEntity> oldDetails = detailRepository.findByRequest(request);
        for (MedicationRequestDetailEntity oldDetail : oldDetails) {
            if (!oldDetail.getProvidedByParent()) {
                MedicationEntity medication = oldDetail.getMedication();
                medication.setQuantity(medication.getQuantity() + oldDetail.getQuantity());
                medicationRepository.save(medication);
            }
        }

        detailRepository.deleteAllByRequest(request);

        request.setRequestDate(LocalDate.now());
        request.setNotes(dto.getNotes());
        request.setStatus(MedicalStatus.PENDING);
        request.setStudent(student);

        Set<MedicationRequestDetailEntity> newDetails = new HashSet<>();

        for (MedicationRequestDetailDTO detailDTO : dto.getMedications()) {
            MedicationEntity medication = medicationRepository.findById(detailDTO.getMedicationId())
                    .orElseThrow(() -> new NotFoundException("Medication not found with id: " + detailDTO.getMedicationId()));

            boolean providedByParent = Boolean.TRUE.equals(detailDTO.getProvidedByParent());

            if (!providedByParent) {
                if (medication.getQuantity() == null || medication.getQuantity() < detailDTO.getQuantity()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số lượng thuốc trong kho không đủ.");
                }

                medication.setQuantity(medication.getQuantity() - detailDTO.getQuantity());
                medicationRepository.save(medication);
            }

            MedicationRequestDetailEntity detail = MedicationRequestMapper.toDetailEntity(detailDTO, request, medication);
            newDetails.add(detail);
        }

        request.setMedicationRequestDetails(newDetails);
        requestRepository.save(request);
        detailRepository.saveAll(newDetails);

        return MedicationRequestMapper.toResponseDTO(request);
    }



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

        StudentEntity student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found with id: " + dto.getStudentId()));

        if (!student.getParent().getUserId().equals(parentId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Học sinh không thuộc quyền quản lý của phụ huynh.");
        }

        MedicationRequestEntity request = MedicationRequestMapper.toEntity(dto, parent, student, generateAcademicYear());
        request.setRequestDate(LocalDate.now());
        request.setStatus(MedicalStatus.PENDING);

        Set<MedicationRequestDetailEntity> detailEntities = new HashSet<>();

        for (MedicationRequestDetailDTO detailDTO : dto.getMedications()) {
            MedicationEntity medication = medicationRepository.findById(detailDTO.getMedicationId())
                    .orElseThrow(() -> new NotFoundException("Medication not found"));

            if (detailDTO.getProvidedByParent() == null || !detailDTO.getProvidedByParent()) {
                if (medication.getQuantity() == null || medication.getQuantity() < detailDTO.getQuantity()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Số lượng thuốc \"" + medication.getMedicationName() + "\" trong kho không đủ.");
                }
                medication.setQuantity(medication.getQuantity() - detailDTO.getQuantity());
                medicationRepository.save(medication);
            }

            MedicationRequestDetailEntity detail = MedicationRequestMapper.toDetailEntity(detailDTO, request, medication);
            detailEntities.add(detail);
        }

        request.setMedicationRequestDetails(detailEntities);

        requestRepository.save(request);
        detailRepository.saveAll(detailEntities);

        List<UserEntity> medicalStaff = userRepository.findByRoleName(RoleEnum.SCHOOL_NURSE);
        for (UserEntity staff : medicalStaff) {
            notificationService.push(
                    parent.getUserId(),
                    staff.getUserId(),
                    "Yêu cầu cấp phát thuốc mới",
                    "Phụ huynh của " + student.getUser().getFullname() + " đã gửi yêu cầu cấp phát thuốc."
            );
        }

        // 7. Trả kết quả (bao gồm cả details)
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

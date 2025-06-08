package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.requests.MedicineRequestCreateDTO;
import sms.swp391.models.dtos.requests.NotificationCreateDTO;
import sms.swp391.models.dtos.responses.MedicineRequestResponse;
import sms.swp391.models.entities.MedicineRequestEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.MedicineRequestRepository;
import sms.swp391.repositories.StudentRepository;
import sms.swp391.services.MedicineRequestService;
import sms.swp391.services.NotificationService;
import sms.swp391.utils.FileUploadUtil;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineRequestServiceImpl implements MedicineRequestService {

    private final MedicineRequestRepository medicineRequestRepository;
    private final StudentRepository studentRepository;
    private final NotificationService notificationService;
    private final FileUploadUtil fileUploadUtil;

    @Override
    @Transactional
    public MedicineRequestResponse createRequest(MedicineRequestCreateDTO request) {
        StudentEntity student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found"));

        MedicineRequestEntity medicineRequest = new MedicineRequestEntity();
        medicineRequest.setStudent(student);
        medicineRequest.setMedicineName(request.getMedicineName());
        medicineRequest.setDosage(request.getDosage());
        medicineRequest.setStartDate(request.getStartDate());
        medicineRequest.setEndDate(request.getEndDate());
        medicineRequest.setTimeOfDay(String.join(",", request.getTimeOfDay()));
        medicineRequest.setSpecialInstructions(request.getSpecialInstructions());

        // Handle prescription image upload if provided
        if (request.getPrescriptionImage() != null && !request.getPrescriptionImage().isEmpty()) {
            String imagePath = fileUploadUtil.saveFile("prescriptions", request.getPrescriptionImage());
            medicineRequest.setPrescriptionImage(imagePath);
        }

        medicineRequest = medicineRequestRepository.save(medicineRequest);

        // Create notification for the request
        notificationService.createNotification(new NotificationCreateDTO(
                "New medicine request for " + student.getUser().getFullname(),
                "Medicine Request: " + request.getMedicineName()
        ));

        return convertToResponse(medicineRequest);
    }

    @Override
    public List<MedicineRequestResponse> getRequestsByStudent(Long studentId) {
        StudentEntity student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found"));

        return medicineRequestRepository.findByStudentOrderByCreatedAtDesc(student)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MedicineRequestResponse updateRequestStatus(Long requestId, String status) {
        MedicineRequestEntity request = medicineRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Medicine request not found"));

        request.setStatus(status.toUpperCase());
        request = medicineRequestRepository.save(request);

        // Create notification for status update
        notificationService.createNotification(new NotificationCreateDTO(
                "Medicine request status updated to " + status,
                "Status Update: " + request.getMedicineName()
        ));

        return convertToResponse(request);
    }

    @Override
    @Transactional
    public void deleteRequest(Long requestId) {
        if (!medicineRequestRepository.existsById(requestId)) {
            throw new NotFoundException("Medicine request not found");
        }
        medicineRequestRepository.deleteById(requestId);
    }

    private MedicineRequestResponse convertToResponse(MedicineRequestEntity entity) {
        MedicineRequestResponse response = new MedicineRequestResponse();
        response.setId(entity.getId());
        response.setStudentId(entity.getStudent().getId());
        response.setStudentName(entity.getStudent().getUser().getFullname());
        response.setMedicineName(entity.getMedicineName());
        response.setDosage(entity.getDosage());
        response.setStartDate(entity.getStartDate());
        response.setEndDate(entity.getEndDate());
        response.setTimeOfDay(Arrays.asList(entity.getTimeOfDay().split(",")));
        response.setSpecialInstructions(entity.getSpecialInstructions());
        response.setPrescriptionImageUrl(entity.getPrescriptionImage());
        response.setStatus(entity.getStatus());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }
} 
package sms.swp391.models.dtos.requests;

import lombok.Data;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.time.LocalDateTime;

@Data
public class MedicalEventUpdateRequestDTO {
    private Long studentId;
    private MedicalStatus status;
    private String followUpNotes;
}
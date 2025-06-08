package sms.swp391.models.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MedicineRequestResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String medicineName;
    private String dosage;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> timeOfDay;
    private String specialInstructions;
    private String prescriptionImageUrl;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
} 
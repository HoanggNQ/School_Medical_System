package sms.swp391.models.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MedicineRequestCreateDTO {
    private Long studentId;
    private String medicineName;
    private String dosage;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> timeOfDay;
    private String specialInstructions;
    private MultipartFile prescriptionImage;
} 
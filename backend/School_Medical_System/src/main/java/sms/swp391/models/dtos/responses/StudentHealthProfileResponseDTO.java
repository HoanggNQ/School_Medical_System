package sms.swp391.models.dtos.responses;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentHealthProfileResponseDTO {
    private Long studentId;
    private BigDecimal heightCm;
    private BigDecimal weightKg;
    private BigDecimal bmi;
    private String visionLeft;
    private String visionRight;
    private String hearing;
    private String dentalHealth;
    private String bloodPressure;
    private Integer pulse;
    private BigDecimal temperature;
    private String bloodType;
    private String geneticDiseases;
    private String allergies;
    private String chronicDiseases;
    private String currentMedications;
    private String otherMedicalNotes;
}

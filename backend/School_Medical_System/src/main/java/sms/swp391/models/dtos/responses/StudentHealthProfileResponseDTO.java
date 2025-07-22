package sms.swp391.models.dtos.responses;

import lombok.*;


@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentHealthProfileResponseDTO {
    private Long studentId;
    private Double heightCm;
    private Double weightKg;
    private Double bmi;
    private String visionLeft;
    private String visionRight;
    private String hearing;
    private String dentalHealth;
    private String bloodPressure;
    private Integer pulse;
    private Double temperature;
    private String bloodType;
    private String geneticDiseases;
    private String allergies;
    private String chronicDiseases;
    private String currentMedications;
    private String otherMedicalNotes;
}

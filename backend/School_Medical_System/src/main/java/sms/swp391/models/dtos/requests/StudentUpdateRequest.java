package sms.swp391.models.dtos.requests;

import lombok.*;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class StudentUpdateRequest {
    private Long classId;
    private Long parentId;
    private String bloodType;
    private String geneticDiseases;
    private String otherMedicalNotes;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String currentMedications;
    private String chronicDiseases;
    private String allergies;
    private Double height;
    private Double weight;
}
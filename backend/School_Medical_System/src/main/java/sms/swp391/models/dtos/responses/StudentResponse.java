package sms.swp391.models.dtos.responses;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponse {
    private Long id;
    private UserResponse user;      // All user attributes
    private Long classId;
    private UserResponse parent;    // All parent user attributes
    private String studentCode;
    private String bloodType;
    private String geneticDiseases;
    private String otherMedicalNotes;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String currentMedications;
    private String chronicDiseases;
    private String allergies;
    private Float height;
    private Float weight;
}
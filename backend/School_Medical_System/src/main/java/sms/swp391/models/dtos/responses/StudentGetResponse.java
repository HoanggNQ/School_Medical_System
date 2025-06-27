package sms.swp391.models.dtos.responses;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentGetResponse {
    private Long userId;
    private String fullName;
    private String dob;
    private String gender;
    private String className;
    private String phoneNumber;
    private String address;
    private String studentCode;
    private String bloodType;
    private String geneticDiseases;
    private String otherMedicalNotes;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String currentMedications;
    private String chronicDiseases;
    private String allergies;
    private Float height;
    private Float weight;
}
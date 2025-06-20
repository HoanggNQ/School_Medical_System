package sms.swp391.models.dtos.respones;

import lombok.*;
import java.util.Map;

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
    private Map<String, String> emergencyContact;
}
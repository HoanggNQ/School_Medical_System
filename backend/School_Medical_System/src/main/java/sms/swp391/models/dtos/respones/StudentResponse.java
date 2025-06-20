package sms.swp391.models.dtos.respones;

import lombok.*;
import java.time.Instant;
import java.util.Map;

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
    private Map<String, String> emergencyContact;
    private Instant createdAt;
    private Instant updatedAt;
}
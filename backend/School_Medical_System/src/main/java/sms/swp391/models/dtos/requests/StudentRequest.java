package sms.swp391.models.dtos.requests;


import lombok.*;
import java.util.Map;
@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentRequest {
    private Long classId;
    private Long parentId;
    private String studentCode;
    private String bloodType;
    private String geneticDiseases;
    private String otherMedicalNotes;
    private Map<String, String> emergencyContact;
    private UserRegisterDTO userRegister;
}
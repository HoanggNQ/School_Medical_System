package sms.swp391.models.dtos.requests;


import lombok.*;

import java.math.BigDecimal;
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
    private UserRegisterDTO userRegister;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String currentMedications;
    private String chronicDiseases;
    private String allergies;
    private BigDecimal height;
    private BigDecimal weight;
}
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
    private String bloodType;
    private UserRegisterDTO userRegister;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String chronicDiseases;
    private String allergies;
    private BigDecimal height;
    private BigDecimal weight;
}
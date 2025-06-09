// src/main/java/sms/swp391/models/dtos/request/StudentRequest.java
package sms.swp391.models.dtos.request;

import lombok.*;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentRequest {
    private Long userId;
    private Long classId;
    private Long parentId;
    private String studentCode;
    private String bloodType;
    private String geneticDiseases;
    private String otherMedicalNotes;
    private Map<String, String> emergencyContact;
}
package sms.swp391.models.dtos.requests;

import java.util.Map;
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
    private Map<String, String> emergencyContact;
}
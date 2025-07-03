package sms.swp391.models.dtos.responses;

import lombok.*;

import java.math.BigDecimal;
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
    private String className;
    private Long parentId;
    private String parentName;
    private String studentCode;
    private String bloodType;
    private String geneticDiseases;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private String chronicDiseases;
    private String allergies;
    private BigDecimal height;
    private BigDecimal weight;
}
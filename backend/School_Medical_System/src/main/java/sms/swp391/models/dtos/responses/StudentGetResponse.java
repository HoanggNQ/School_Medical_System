package sms.swp391.models.dtos.responses;

import lombok.*;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentGetResponse {
    private Long studentId;
    private String fullName;
    private String parentID;
    private String parentName;
    private String dob;
    private String gender;
    private String className;
    private String phoneNumber;
    private String address;
    private String studentCode;
    private String avatarUrl;
}

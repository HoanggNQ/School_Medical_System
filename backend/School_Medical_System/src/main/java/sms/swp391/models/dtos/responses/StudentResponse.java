package sms.swp391.models.dtos.responses;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponse {
    private Long id;
    private UserResponse user;
    private Long classId;
    private String className;
    private Long parentId;
    private String parentName;
    private String studentCode;
    private String avatarUrl;
}
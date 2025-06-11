package sms.swp391.models.dtos.respones;

import lombok.*;
import sms.swp391.models.dtos.enums.RoleEnum;

import java.time.Instant;
import java.time.LocalDate;

/**
 * DTO for {@link sms.swp391.models.entities.UserEntity}
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse  {
    Long userId;
    String userName;
    String fullName;
    String email;
    String phoneNumber;
    LocalDate dob;
    String gender;
    String address;
    RoleEnum roleName;
    String avatarUrl;
    String status;
    Instant dateCreated;
    Instant updatedAt;

}
package sms.swp391.models.dtos.requests;

import lombok.*;
import sms.swp391.models.dtos.enums.RoleEnum;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChooseRoleRequest {
    private String email;
    private RoleEnum role;
}

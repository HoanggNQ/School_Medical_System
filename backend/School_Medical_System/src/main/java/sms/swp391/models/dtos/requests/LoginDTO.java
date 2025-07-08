package sms.swp391.models.dtos.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(description = "Login request")
public class LoginDTO {

    @Schema(example = "student@gmail.com")
    private String email;

    @Schema(example = "123456")
    private String password;
}

package sms.swp391.models.dtos.requests;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.format.annotation.NumberFormat;
import sms.swp391.models.dtos.enums.RoleEnum;

import java.time.LocalDate;
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisterDTO {
    @Email
    @Pattern(regexp = "\\S+", message = "Email must not contain whitespace")
    @NotEmpty(message = "Email must not be empty")
    private String email;

    @Pattern(regexp = "\\S+", message = "Password must not contain whitespace")
    @NotEmpty(message = "Password must not be empty")
    private String password;

    @NotEmpty(message = "Username must not be empty")
    private String username;

    @NotEmpty(message = "Full name must not be empty")
    private String fullName;

    @NotEmpty(message = "Address must not be empty")
    private String address;

    @NotEmpty(message = "Gender must not be empty")
    private String gender;

    @NotNull(message = "Date of birth must not be null")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dob;

    @Pattern(regexp = "^0\\d{9}$", message = "Phone number must start with 0 and have 10 digits")
    @NotEmpty(message = "Phone number must not be empty")
    private String phoneNumber;

    @NotNull(message = "Role must not be null")
    private RoleEnum roleName;
}


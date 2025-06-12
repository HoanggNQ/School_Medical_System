package sms.swp391.models.dtos.requests;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.NumberFormat;
import sms.swp391.models.dtos.enums.RoleEnum;

import java.time.LocalDate;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterDTO {
    @Email
    @Pattern(regexp = "\\S+", message = "Email must not contain whitespace")
    @NotEmpty(message = "Email must not be empty")
    private String email;

    @Pattern(regexp = "\\S+", message = "Password must not contain whitespace")
    @NotEmpty(message = "Password must not be empty")
    private String password;
    @NotEmpty(message = "name not null!!!")
    private String username;
    @NotEmpty(message = "name not null!!!")
    private String Fullname;

    @NotEmpty(message = "address not null!!!")
    private String address;

    @NotEmpty(message = "gender not null!!!")
    private String gender;

    @NotNull(message = "Dob not null!!!")
    @Past(message = "Dob must be in the past!!!")
    private LocalDate Dob;

    @NumberFormat(style = NumberFormat.Style.CURRENCY)
    @Pattern(regexp = "^0\\d{9}$", message = "Phone number must start with 0 and have 10 digits")
    @NotEmpty(message = "Phone number must not be empty")
    private String phoneNumber;


}

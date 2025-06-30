package sms.swp391.models.dtos.requests;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateDTO {

    @Positive(message = "ID must be positive")
    private long id;

    @NotBlank(message = "Name must not be blank")
    private String name;

    @NotBlank(message = "Address must not be blank")
    private String address;

    @NotBlank(message = "Gender must not be blank")
    private String gender;

    @NotNull(message = "Dob must not be null")
    @Past(message = "Dob must be in the past")
    private LocalDate dob;
}

package sms.swp391.models.dtos.requests;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
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
    private long id;

    @NotEmpty(message = "name not null!!!")
    private String name;

    @NotEmpty(message = "address not null!!!")
    private String address;

    @NotEmpty(message = "gender not null!!!")
    private String gender;

    @NotNull(message = "Dob not null!!!")
    @Past(message = "Dob must be in the past!!!")
    private LocalDate Dob;


}

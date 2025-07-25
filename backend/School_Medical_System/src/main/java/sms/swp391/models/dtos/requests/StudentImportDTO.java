package sms.swp391.models.dtos.requests;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class StudentImportDTO {
    private String email;
    private String password;
    private String username;
    private String phone;
    private String fullname;
    private String address;
    private String gender;
    private LocalDate dob;
    private Long classId;
    private Long parentId;
}


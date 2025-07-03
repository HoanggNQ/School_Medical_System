package sms.swp391.models.dtos.requests;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class StudentImportDTO {
    private String email;
    private String password;
    private String username;
    private String fullname;
    private String address;
    private String gender;
    private LocalDate dob;
    private String phoneNumber;
    private Long classId;
    private Long parentId;
    private String bloodType;
    private String geneticDiseases;
    private String chronicDiseases;
    private String allergies;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private BigDecimal height;
    private BigDecimal weight;
}


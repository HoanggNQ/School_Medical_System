package sms.swp391.models.dtos.requests;

import lombok.Data;

@Data
public class OTPVerifyRequestDTO {
    private String otp;
    private String email;
}

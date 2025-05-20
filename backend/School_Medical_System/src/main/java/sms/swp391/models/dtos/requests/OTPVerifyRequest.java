package sms.swp391.models.dtos.requests;

import lombok.Data;

@Data
public class OTPVerifyRequest {
    private String otp;
    private String email;
}

package sms.swp391.services;

import sms.swp391.models.dtos.requests.OTPVerifyRequestDTO;

public interface OTPService {
    void verifyOTP(OTPVerifyRequestDTO request);

    void generateOTPCode(String identity,String template);

    void generateOTPCodeAgain(String identity,String template);

    void changePasswordOtp(String email, String newPassword);

    String verifyOtpSetPassword(OTPVerifyRequestDTO request);

    void resendOTPSetPassword(String email);
}
package sms.swp391.services;

import sms.swp391.models.dtos.requests.OTPVerifyRequest;

public interface OTPService {
    void verifyOTP(OTPVerifyRequest request);

    void generateOTPCode(String identity,String template);

    void generateOTPCodeAgain(String identity,String template);

    void changePasswordOtp(String email, String newPassword);

    String verifyOtpSetPassword(OTPVerifyRequest request);

    void resendOTPSetPassword(String email);
}
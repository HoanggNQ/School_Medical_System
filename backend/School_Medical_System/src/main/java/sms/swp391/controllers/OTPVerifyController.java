package sms.swp391.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.enums.TemplateEnum;
import sms.swp391.models.dtos.requests.OTPVerifyRequest;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.services.OTPService;
import sms.swp391.services.UserService;

@RestController
@RequestMapping("/api/v1/otp")
@RequiredArgsConstructor
public class OTPVerifyController {

    private final OTPService otpService;
    private final UserService userService;

    @PatchMapping("/verify")
    public ResponseEntity<ResponseObject> verifyOTP(@RequestBody OTPVerifyRequest request) {
        try {
            otpService.verifyOTP(request);
            userService.ActiveUser(request.getEmail());
            return buildSuccessResponse("Verify OTP Success");
        } catch (Exception e) {
            return buildErrorResponse("OTP verification failed", e);
        }
    }

    @PatchMapping("/verify-set-password")
    public ResponseEntity<ResponseObject> verifyOTPSetPassword(@RequestBody OTPVerifyRequest request) {
        try {
            String newPassword = otpService.verifyOtpSetPassword(request);
            userService.setPassword(request.getEmail(), newPassword);
            return buildSuccessResponse("Set new password successfully");
        } catch (Exception e) {
            return buildErrorResponse("Setting new password failed", e);
        }
    }

    @PatchMapping("/verify-set-password-forgot")
    public ResponseEntity<ResponseObject> verifyOTPSetPasswordForgot(
            @RequestBody OTPVerifyRequest request,
            @RequestParam String newPassword,
            @RequestParam String confirmPassword) {
        try {
            otpService.verifyOTP(request);
            userService.setPasswordForget(request.getEmail(), newPassword, confirmPassword);
            return buildSuccessResponse("Reset password successfully");
        } catch (Exception e) {
            return buildErrorResponse("Password reset failed", e);
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<ResponseObject> resendOtp(@RequestParam String email) {
        try {
            otpService.generateOTPCodeAgain(email, TemplateEnum.ACCOUNT.toString());
            return buildSuccessResponse("OTP sent successfully");
        } catch (Exception e) {
            return buildErrorResponse("Resend OTP failed", e);
        }
    }

    @PostMapping("/resend-forgot-password")
    public ResponseEntity<ResponseObject> resendOtpForForgotPassword(@RequestParam String email) {
        try {
            otpService.generateOTPCodeAgain(email, TemplateEnum.PASSWORD.toString());
            return buildSuccessResponse("OTP for password reset sent successfully");
        } catch (Exception e) {
            return buildErrorResponse("Resend OTP for password reset failed", e);
        }
    }

    @PostMapping("/resend-set-password")
    public ResponseEntity<ResponseObject> resendOtpForSetPassword(@RequestParam String email) {
        try {
            otpService.resendOTPSetPassword(email);
            return buildSuccessResponse("OTP for setting password sent successfully");
        } catch (Exception e) {
            return buildErrorResponse("Resend OTP for setting password failed", e);
        }
    }

    // Helper methods
    private ResponseEntity<ResponseObject> buildSuccessResponse(String message) {
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("VERIFY_SUCCESS")
                        .status(HttpStatus.OK)
                        .message(message)
                        .isSuccess(true)
                        .build()
        );
    }

    private ResponseEntity<ResponseObject> buildErrorResponse(String message, Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResponseObject.builder()
                        .code("VERIFY_FAILED")
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .message(message + ": " + e.getMessage())
                        .isSuccess(false)
                        .build());
    }
}

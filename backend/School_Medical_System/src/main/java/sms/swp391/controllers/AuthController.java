package sms.swp391.controllers;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.enums.TemplateEnum;
import sms.swp391.models.dtos.requests.LoginDTO;
import sms.swp391.models.dtos.requests.UserRegisterDTO;
import sms.swp391.models.dtos.respones.JwtResponse;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.models.dtos.respones.UserResponse;
import sms.swp391.services.AuthService;
import sms.swp391.services.OTPService;
import sms.swp391.services.UserService;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final OTPService otpService;

    @PostMapping("/login")
    public ResponseEntity<ResponseObject> login(@RequestBody LoginDTO loginDto) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginDto);
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .code("AUTH_SUCCESS")
                            .message("Welcome To Second Chance Shop")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(jwtResponse)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("LOGIN_FAILED")
                            .message("Failed to create user: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }

    }
    @PostMapping(value = "register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> register(@RequestPart("user") UserRegisterDTO userRegisterDTO) {
        try {
            UserResponse userResponse = authService.registerUser(userRegisterDTO);
            otpService.generateOTPCode(userResponse.getEmail(), TemplateEnum.ACCOUNT.toString());

            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .code("REGISTER_SUCCESS")
                            .message("Create user successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(userResponse)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("REGISTER_FAILED")
                            .message("Failed to create user: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }


}

package sms.swp391.controllers;


import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.LoginDTO;
import sms.swp391.models.dtos.responses.JwtResponse;
import sms.swp391.models.dtos.responses.ResponseObject;
import sms.swp391.models.exception.ActionFailedException;
import sms.swp391.models.exception.AuthFailedException;
import sms.swp391.services.AuthService;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @Operation(
            summary = "Login",
            description = "Login by Email"
    )
    @PostMapping("/login")
    public ResponseEntity<ResponseObject> login(@RequestBody LoginDTO loginDto) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginDto);
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .code("AUTH_SUCCESS")
                            .message("Welcome To School Medical System")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(jwtResponse)
                            .build()
            );

        } catch (AuthFailedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseObject.builder()
                            .code("INVALID_CREDENTIALS")
                            .message(e.getMessage())  // "Invalid email or password"
                            .status(HttpStatus.UNAUTHORIZED)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseObject.builder()
                            .code("INVALID_CREDENTIALS")
                            .message("Invalid username or password")
                            .status(HttpStatus.UNAUTHORIZED)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );

        } catch (ActionFailedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .code("ACTION_FAILED")
                            .message(e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("LOGIN_FAILED")
                            .message("Internal error: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }


//    @PostMapping(
//            value = "/register",
//            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<ResponseObject> register(
//            @RequestPart("user") @Valid UserRegisterDTO userRegisterDTO) {
//        try {
//            UserResponse userResponse = authService.registerUser(userRegisterDTO);
//            otpService.generateOTPCode(userResponse.getEmail(), TemplateEnum.ACCOUNT.toString());
//
//            return ResponseEntity.ok().body(
//                    ResponseObject.builder()
//                            .code("REGISTER_SUCCESS")
//                            .message("Create user successfully")
//                            .status(HttpStatus.OK)
//                            .isSuccess(true)
//                            .data(userResponse)
//                            .build()
//            );
//
//        } catch (ConflictException e) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(
//                    ResponseObject.builder()
//                            .code("REGISTER_CONFLICT")
//                            .message(e.getMessage())
//                            .status(HttpStatus.CONFLICT)
//                            .isSuccess(false)
//                            .data(null)
//                            .build()
//            );
//
//        } catch (ActionFailedException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
//                    ResponseObject.builder()
//                            .code("REGISTER_FAILED")
//                            .message(e.getMessage())
//                            .status(HttpStatus.BAD_REQUEST)
//                            .isSuccess(false)
//                            .data(null)
//                            .build()
//            );
//
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                    ResponseObject.builder()
//                            .code("REGISTER_FAILED")
//                            .message("Internal error: " + e.getMessage())
//                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                            .isSuccess(false)
//                            .data(null)
//                            .build()
//            );
//        }
//    }


}

package sms.swp391.controllers;


import io.lettuce.core.RedisConnectionException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.enums.TemplateEnum;
import sms.swp391.models.dtos.requests.ChangePassworDTO;
import sms.swp391.models.dtos.requests.ChooseRoleRequest;
import sms.swp391.models.dtos.requests.UserRegisterDTO;
import sms.swp391.models.dtos.requests.UserUpdateDTO;
import sms.swp391.models.dtos.respones.PaginatedUserResponse;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.models.dtos.respones.UserResponse;
import sms.swp391.services.OTPService;
import sms.swp391.services.UserService;

import java.util.List;

@RequestMapping("/api/v1/user")
@RestController
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final OTPService otpService;



    @PutMapping(path = "update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> update(@RequestPart("user") UserUpdateDTO updateUserDTO,
                                                 @RequestPart(value = "file", required = false) MultipartFile image) {
        UserResponse userResponse = userService.updateUser(updateUserDTO, image);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Update user successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(userResponse)
                        .build()
        );
    }

    @GetMapping("/list-user")
    public ResponseEntity<ResponseObject> listUser() {
        List<UserResponse> userList = userService.getListUser();
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .code("GET_lIST_SUCCESS")
                        .message("Get list user successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(userList)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getUserId(@RequestParam long id) {
        UserResponse userResponse = userService.getUserById(id);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get user successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(userResponse)
                        .build()
        );
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> deleteUser(@PathVariable long id) {
        UserResponse userResponse = userService.userDelete(id);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Delete user successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(userResponse)
                        .build()
        );
    }
    @GetMapping
    public ResponseEntity<ResponseObject> getUsers(
            @RequestParam(value = "search", required = false) String search,
            @PageableDefault(page = 0, size = 10)
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "fullname", direction = Sort.Direction.ASC),
                    @SortDefault(sort = "username", direction = Sort.Direction.DESC)
            }) Pageable pageable) {
        PaginatedUserResponse userResponse = userService.getUsers(search, pageable);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get user successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(userResponse)
                        .build()
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<ResponseObject> getUserProfile() {
        UserResponse userResponse = userService.getUserProfile();
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get user successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(userResponse)
                        .build()
        );
    }

    @PutMapping(path = "change-password")
    public ResponseEntity<ResponseObject> changePassword(@RequestBody ChangePassworDTO changePassworDTO) {
        // First validate the old password and apply the new one
        UserResponse userResponse = userService.changPassword(
                changePassworDTO.getEmail(),
                changePassworDTO.getOldPassword(),
                changePassworDTO.getNewPassword(),
                changePassworDTO.getNewPasswordConfirm());

        // Optionally: send OTP confirmation for sensitive changes
        otpService.generateOTPCode(userResponse.getEmail(), TemplateEnum.PASSWORD.toString());

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("PASSWORD_CHANGED_OTP_SENT")
                        .message("Password changed successfully. OTP sent to confirm change.")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(userResponse)
                        .build()
        );
    }

    @PutMapping(path = "forget-password")
    public ResponseEntity<ResponseObject> forgetPass(@RequestParam String email) {
        // Check if user exists
        UserResponse user = userService.checkUser(email);

        // Generate OTP for password reset
        otpService.generateOTPCode(email, TemplateEnum.PASSWORD.toString());

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("OTP_SENT")
                        .message("OTP has been sent to your email for password reset.")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(user)
                        .build()
        );
    }

    @PostMapping("/choose-role")
    public ResponseEntity<String> chooseRole(@RequestBody ChooseRoleRequest request) {
        userService.chooseRole(request.getEmail(), request.getRole());
        return ResponseEntity.ok("Role assigned successfully");
    }

}
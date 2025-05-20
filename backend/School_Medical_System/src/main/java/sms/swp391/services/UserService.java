package sms.swp391.services;

import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.requests.UserRegisterDTO;
import sms.swp391.models.dtos.requests.UserUpdateDTO;
import sms.swp391.models.dtos.respones.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getListUser();

    UserResponse userDelete(long id);

    UserResponse getUsers(String search, Pageable pageable);

    void ActiveUser(String email);

    UserResponse getUserById(long id);

    UserResponse getUserProfile();


    UserResponse updateUser(UserUpdateDTO updateUserDTO, MultipartFile image);

    UserResponse changPassword(String email,String oldPassword, String newPassword, String newPasswordConfirm);
    void setPassword(String email, String password);

    UserResponse checkUser(String email);

    UserResponse setPasswordForget(String email, String newPassword, String newPasswordConfirm);
}

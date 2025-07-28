package sms.swp391.services;

import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.requests.UserRegisterDTO;
import sms.swp391.models.dtos.requests.UserUpdateDTO;
import sms.swp391.models.dtos.responses.PaginatedUserResponse;
import sms.swp391.models.dtos.responses.UserResponse;

import java.io.IOException;
import java.util.List;

public interface UserService {
    @Transactional
    List<UserResponse> searchParentByName(String name);

    List<UserResponse> getListUser();

    UserResponse userDelete(long id);

    PaginatedUserResponse getUsers(String search, Pageable pageable);
    PaginatedUserResponse getUsersByRoleName(RoleEnum search, Pageable pageable);

    void ActiveUser(String email);

    UserResponse getUserById(long id);

    UserResponse getUserProfile();


    UserResponse updateUser(UserUpdateDTO updateUserDTO, MultipartFile image);

    UserResponse changPassword(String email,String oldPassword, String newPassword, String newPasswordConfirm);
    void setPassword(String email, String password);

    UserResponse checkUser(String email);
    UserResponse createNurse(UserRegisterDTO userRegisterDTO);
    UserResponse setPasswordForget(String email, String newPassword, String newPasswordConfirm);
    void chooseRole(String email , RoleEnum role);

    List<UserResponse> importUsersFromExcel(MultipartFile excelFile) throws IOException;
    List<UserResponse> bulkCreateUsers(List<UserRegisterDTO> dtos);
}

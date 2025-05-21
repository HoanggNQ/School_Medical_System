package sms.swp391.services.impl;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.enums.StatusEnum;
import sms.swp391.models.dtos.requests.UserUpdateDTO;
import sms.swp391.models.dtos.respones.UserResponse;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.*;
import sms.swp391.repositories.UserRepository;
import sms.swp391.services.OTPService;
import sms.swp391.services.UserService;
import sms.swp391.utils.Constants;
import sms.swp391.utils.EntityToDTO;


import java.util.List;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final OTPService otpService;
    private PasswordEncoder passwordEncoder;

    @Override
    public List<UserResponse> getListUser() {
        List<UserEntity> userEntities = userRepository.findAll();
        var userResponses = userEntities.stream().map(EntityToDTO::UserEntityToDTO).toList();
        return userResponses;
    }

    @Override
    public UserResponse userDelete(long id) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(
                        String.format("Cannot find user with ID: %s", id)
                ));
        userEntity.setStatus(StatusEnum.DELETED);
        try {
            var item = userRepository.save(userEntity);
            UserResponse userResponse = EntityToDTO.UserEntityToDTO(item);
            return userResponse;
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed delete user with ID: %s", id));
        }
    }

    @Override
    public UserResponse getUsers(String search, Pageable pageable) {
        return null;
    }

    @Override
    public void ActiveUser(String email) {
        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(
                () -> new NotFoundException("User not found!")
        );
        userEntity.setStatus(StatusEnum.ACTIVE);
        userRepository.save(userEntity);
    }


    @Override
    public UserResponse getUserById(long id) {
        UserEntity uEntity = userRepository.findById(id).orElseThrow(
                () -> new NotFoundException("user not found")
        );
        UserResponse userResponse = EntityToDTO.UserEntityToDTO(uEntity);
        return userResponse;
    }


    @Override
    public UserResponse getUserProfile() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) throw new AuthFailedException("This user is't authentication, please login again");
            String username = auth.getName();
            UserEntity userEntity = userRepository.findByUsername(username).orElseThrow(
                    () -> new NotFoundException("user not found")
            );
            return EntityToDTO.UserEntityToDTO(userEntity);
        } catch (Exception e) {
            throw new AuthFailedException("This user isn't authentication, please login again");
        }
    }

    @Override
    public UserResponse updateUser(UserUpdateDTO updateUserDTO, MultipartFile image) {
        UserEntity userEntity = userRepository.findById(updateUserDTO.getId())
                .orElseThrow(() -> new NotFoundException(
                        String.format("Cannot find user with ID: %s", updateUserDTO.getId())
                ));
        userEntity.setDob(updateUserDTO.getDob());
        userEntity.setAddress(updateUserDTO.getAddress());
        userEntity.setGender(updateUserDTO.getGender());
        userEntity.setFullname(updateUserDTO.getName());

        var item = userRepository.save(userEntity);
        UserResponse userResponse = EntityToDTO.UserEntityToDTO(item);
        return userResponse;

    }
    @Override
    public UserResponse changPassword(String email,String oldPassword, String newPassword, String newPasswordConfirm) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        if (!passwordEncoder.matches(oldPassword, userEntity.getPassword())) {
            throw new ValidationFailedException("Old password is incorrect");
        }

        if (!newPassword.equals(newPasswordConfirm)) {
            throw new ValidationFailedException("New password and confirmation do not match");
        }
        return EntityToDTO.UserEntityToDTO(userEntity);
    }
    @Override
    public void setPassword(String email, String password) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        userEntity.setPassword(password);
        userRepository.save(userEntity);
    }

    @Override
    public UserResponse checkUser(String email) {
        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(
                ()-> new NotFoundException("User not found")
        );
        if(userEntity.getStatus().equals(StatusEnum.DELETED)){
            throw  new ActionFailedException("account has been deleted");
        }
        if(userEntity.getStatus().equals(StatusEnum.BAN)){
            throw new ActionFailedException("account has been ban");
        }
        if(userEntity.getStatus().equals(StatusEnum.VERIFY)){
            throw new ActionFailedException("account has been not verify");
        }
        return EntityToDTO.UserEntityToDTO(userEntity);
    }
    @Override
    public UserResponse setPasswordForget(String email, String newPassword, String newPasswordConfirm) {
        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(
                ()-> new NotFoundException("User not found")
        );
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (passwordEncoder.matches(newPassword, userEntity.getPassword())) {
            throw new ValidationFailedException("This Is Old password");
        }
        String password = passwordEncoder.encode(newPassword);
        userEntity.setPassword(password);
        userRepository.save(userEntity);
        return EntityToDTO.UserEntityToDTO(userEntity);
    }


    @Override
    public void chooseRole(String email, RoleEnum role) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (userEntity.getRoleName() != null) {
            throw new ActionFailedException("Role has already been assigned");
        }
        userEntity.setRoleName(role);
        userRepository.save(userEntity);
    }

}

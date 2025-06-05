package sms.swp391.services.impl;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.enums.StatusEnum;
import sms.swp391.models.dtos.requests.UserUpdateDTO;
import sms.swp391.models.dtos.respones.PaginatedUserResponse;
import sms.swp391.models.dtos.respones.UserResponse;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.*;
import sms.swp391.repositories.UserRepository;
import sms.swp391.services.UserService;
import sms.swp391.utils.UserMapper;


import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;

    @Override
    public List<UserResponse> getListUser() {
        List<UserEntity> userEntities = userRepository.findAll();
        var userResponses = userEntities.stream().map(UserMapper::toDTO).toList();
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
            UserResponse userResponse = UserMapper.toDTO(item);
            return userResponse;
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed delete user with ID: %s", id));
        }
    }

    @Override
    public PaginatedUserResponse getUsers(String search, Pageable pageable) {
        Sort validatedSort = pageable.getSort().stream()
                .filter(order -> {
                    String property = order.getProperty();
                    return property.equals("fullname") || property.equals("username");
                })
                .collect(Collectors.collectingAndThen(
                        Collectors.toList(),
                        Sort::by
                ));

        Pageable validatedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                validatedSort
        );

        Page<UserEntity> userPage;
        if (search != null && !search.isEmpty()) {
            userPage = userRepository.searchUsers(search, validatedPageable);
        } else {
            userPage = userRepository.findAll(validatedPageable);
        }

        List<UserResponse> userDTOs = userPage.stream()
                .map(UserMapper::toDTO)
                .toList();

        return PaginatedUserResponse.builder()
                .users(userDTOs)
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .currentPage(userPage.getNumber())
                .build();
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
        UserResponse userResponse = UserMapper.toDTO(uEntity);
        return userResponse;
    }


    @Override
    public UserResponse getUserProfile() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) throw new AuthFailedException("This user is't authentication, please login again");
            String mail = auth.getName();
            UserEntity userEntity = userRepository.findByEmail(mail).orElseThrow(
                    () -> new NotFoundException("user not found")
            );
            return UserMapper.toDTO(userEntity);
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
        UserResponse userResponse = UserMapper.toDTO(item);
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
        return UserMapper.toDTO(userEntity);
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
        return UserMapper.toDTO(userEntity);
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
        return UserMapper.toDTO(userEntity);
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

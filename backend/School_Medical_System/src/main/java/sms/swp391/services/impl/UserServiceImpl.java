package sms.swp391.services.impl;

import jakarta.validation.ConstraintViolation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Validator;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.enums.StatusEnum;
import sms.swp391.models.dtos.requests.UserRegisterDTO;
import sms.swp391.models.dtos.requests.UserUpdateDTO;
import sms.swp391.models.dtos.responses.PaginatedUserResponse;
import sms.swp391.models.dtos.responses.UserResponse;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.*;
import sms.swp391.repositories.UserRepository;
import sms.swp391.services.FileDatabaseService;
import sms.swp391.services.UserService;
import sms.swp391.utils.UserMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static sms.swp391.utils.ExcelExporter.parseUsersFromExcel;
@Slf4j
@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileDatabaseService fileDatabaseService;
    private final Validator validator;
    @Transactional
    @Override
    public List<UserResponse> searchParentByName(String name) {
        if (name == null || name.isBlank()) {
            throw new ValidationFailedException("Name cannot be null or empty");
        }
        List<UserEntity> userEntities = userRepository.findByRoleNameAndFullnameAndStatusContainingIgnoreCase(RoleEnum.PARENT, name,StatusEnum.ACTIVE);
        return userEntities.stream().map(UserMapper::toDTO).toList();
    }

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

        Pageable validatedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSort()
        );

        Page<UserEntity> userPage = (search != null && !search.isBlank())
                ? userRepository.searchUsers(search.trim(), validatedPageable)
                : userRepository.findAll(validatedPageable);

        List<UserResponse> users = userPage
                .map(UserMapper::toDTO)
                .toList();

        return PaginatedUserResponse.builder()
                .users(users)
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .currentPage(userPage.getNumber())
                .build();
    }


    @Override
    public PaginatedUserResponse getUsersByRoleName(RoleEnum search, Pageable pageable) {
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
        if (search != null && !search.toString().isEmpty()) {
            userPage = userRepository.searchUsersByRoleName(search, validatedPageable);
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
    public UserResponse updateUser(@Validated UserUpdateDTO dto,
                                   MultipartFile image) {

        var user = userRepository.findById(dto.getId())
                .orElseThrow(() -> new NotFoundException(
                        "Cannot find user with ID: %d".formatted(dto.getId())));

        user.setDob(dto.getDob());
        user.setAddress(dto.getAddress());
        user.setGender(dto.getGender());
        user.setFullname(dto.getName());

        if (image != null && !image.isEmpty()) {
            var uploadResult = fileDatabaseService.uploadFile(image);
            user.setAvatarurl(uploadResult.getUrl());
        }

        var saved = userRepository.save(user);
        return UserMapper.toDTO(saved);
    }
    @Override
    public UserResponse changPassword(String email, String oldPassword, String newPassword, String newPasswordConfirm) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!passwordEncoder.matches(oldPassword, userEntity.getPassword())) {
            throw new ValidationFailedException("Old password is incorrect");
        }

        if (!newPassword.equals(newPasswordConfirm)) {
            throw new ValidationFailedException("New password and confirmation do not match");
        }

        userEntity.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(userEntity);

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
    public UserResponse createNurse(UserRegisterDTO userRegisterDTO) {
        Optional<UserEntity> userEntity = userRepository.findByEmail(userRegisterDTO.getEmail());
        if (userEntity.isPresent()) {
            switch (userEntity.get().getStatus().toString()) {
                case "ACTIVE" -> throw new ConflictException("Email already exists!");
                case "BAN" -> throw new ActionFailedException("CAN_LOGIN", "Your account has been banned");
                case "DELETED" -> throw new ActionFailedException("CAN_LOGIN", "Your account has been deleted");
            }
        }

        if (userRepository.existsByUsername(userRegisterDTO.getUsername())) {
            throw new ConflictException("Username already exists!");
        }

        if (userRepository.existsByPhoneNumber(userRegisterDTO.getPhoneNumber())) {
            throw new ConflictException("Phone already exists!");
        }

        String password = passwordEncoder.encode(userRegisterDTO.getPassword());
        UserEntity userCreate = UserMapper.fromRegisterDTO(userRegisterDTO);
        userCreate.setStatus(StatusEnum.ACTIVE);
        userCreate.setPassword(password);
        userRepository.save(userCreate);

        return UserMapper.toDTO(userCreate);
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
    @Override
    @Transactional
    public List<UserResponse> importUsersFromExcel(MultipartFile excelFile) throws IOException {
        if (excelFile.isEmpty()) {
            throw new IllegalArgumentException("Excel file must not be empty");
        }

        List<UserRegisterDTO> dtos;
        try (InputStream in = excelFile.getInputStream()) {
            dtos = parseUsersFromExcel(in);
        }

        return bulkCreateUsers(dtos);
    }
    @Override
    @Transactional
    public List<UserResponse> bulkCreateUsers(List<UserRegisterDTO> dtos) {

        List<UserResponse> result = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (int i = 0; i < dtos.size(); i++) {
            UserRegisterDTO dto = dtos.get(i);
            int rowNum = i + 2; // header Excel ở dòng 1

            Set<ConstraintViolation<UserRegisterDTO>> violations = validator.validate(dto);
            if (!violations.isEmpty()) {
                String msg = violations.stream()
                        .map(ConstraintViolation::getMessage)
                        .collect(Collectors.joining("; "));
                errors.add("Row " + rowNum + ": " + msg);
                continue;
            }
            if (userRepository.existsByEmail(dto.getEmail())) {
                errors.add("Row " + rowNum + ": email '" + dto.getEmail() + "' already exists");
                continue;
            }
            if (userRepository.existsByPhoneNumber(dto.getPhoneNumber())) {
                errors.add("Row " + rowNum + ": phone '" + dto.getPhoneNumber() + "' already exists");
                continue;
            }
            UserEntity entity = UserMapper.toEntity(dto);
            entity.setRoleName(dto.getRoleName());
            entity.setPassword(passwordEncoder.encode(dto.getPassword()));
            entity.setStatus(StatusEnum.ACTIVE);

            userRepository.save(entity);
            result.add(UserMapper.toDTO(entity));
        }
        if (!errors.isEmpty()) {
            log.warn("Bulk import completed with {} errors: {}", errors.size(), errors);
        }

        return result;
    }

}
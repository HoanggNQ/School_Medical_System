package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.enums.StatusEnum;
import sms.swp391.models.dtos.enums.TemplateEnum;
import sms.swp391.models.dtos.requests.LoginDTO;
import sms.swp391.models.dtos.requests.UserRegisterDTO;
import sms.swp391.models.dtos.respones.JwtResponse;
import sms.swp391.models.dtos.respones.UserResponse;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.ActionFailedException;
import sms.swp391.models.exception.AuthFailedException;
import sms.swp391.models.exception.ConflictException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.UserRepository;
import sms.swp391.security.JwtService;
import sms.swp391.services.AuthService;
import sms.swp391.services.OTPService;
import sms.swp391.utils.UserMapper;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OTPService oTPService;

    @Override
    public UserResponse registerUser(UserRegisterDTO userRegisterDTO) {
        Optional<UserEntity> userEntity = userRepository.findByEmail(userRegisterDTO.getEmail());

        if (userEntity.isPresent()) {
            switch (userEntity.get().getStatus().toString()) {
                case "VERIFY" -> {
                    oTPService.generateOTPCodeAgain(userRegisterDTO.getEmail(), TemplateEnum.ACCOUNT.toString());
                    throw new ActionFailedException("Email đã được đăng kí nhưng với username " +
                            userEntity.get().getUsername() + " chưa xác thực. Đã gửi OTP để xác thực. Vui lòng kiểm tra email.");
                }
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
        userCreate.setStatus(StatusEnum.VERIFY);
        userCreate.setPassword(password);
        userRepository.save(userCreate);

        return UserMapper.toDTO(userCreate);
    }

    @Override
    public JwtResponse authenticateUser(LoginDTO loginDto) {
        try {
            // 1. Authenticate user credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
            );

            // 2. Get user details from database
            UserEntity userEntity = userRepository.findByEmail(loginDto.getEmail())
                    .orElseThrow(() -> new NotFoundException("User not found"));

            // 3. Check account status
            switch (userEntity.getStatus().toString()) {
                case "BAN":
                    throw new ActionFailedException("CAN_LOGIN", "Your account has been banned");
                case "DELETED":
                    throw new ActionFailedException("CAN_LOGIN", "Your account has been deleted");
                case "VERIFY":
                    throw new ActionFailedException("CAN_LOGIN", "Please verify your account first");
            }

            // 4. Generate tokens
            String token = jwtService.generateToken(authentication);
            String refreshToken = jwtService.generateRefreshToken(authentication);

            JwtResponse.UserInfo userInfo = new JwtResponse.UserInfo(
                    userEntity.getUserId(),
                    userEntity.getUsername(),
                    userEntity.getEmail(),
                    userEntity.getRoleName().toString()
            );

            return new JwtResponse(
                    token,
                    refreshToken,
                    86400000 / 1000,
                    userInfo
            );
        } catch (BadCredentialsException e) {
            throw new AuthFailedException("Invalid email or password");
        } catch (NotFoundException | ActionFailedException e) {
            throw e;
        } catch (Exception e) {
            throw new AuthFailedException("Authentication failed: " + e.getMessage());
        }
    }
}
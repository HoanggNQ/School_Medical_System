package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
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
import sms.swp391.utils.DTOToEntity;
import sms.swp391.utils.EntityToDTO;

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

        if (userEntity.isPresent() && userEntity.get().getStatus().equals("VERIFY")) {
            oTPService.generateOTPCodeAgain(userRegisterDTO.getEmail(), TemplateEnum.ACCOUNT.toString());
            throw new ActionFailedException("Email đã được đăng kí nhưng với username " +
                    userEntity.get().getUsername() + " chưa xác thực. Đã gửi OTP để xác thực. Vui lòng kiểm tra email.");
        } else if (userEntity.isPresent() && userEntity.get().getStatus().equals("ACTIVE")) {
            throw new ConflictException("Email already exists!");
        }

        if (userRepository.existsByUsername(userRegisterDTO.getUsername())) {
            throw new ConflictException("Username already exists!");
        }
        if (userRepository.existsByPhoneNumber(userRegisterDTO.getPhoneNumber())) {
            throw new ConflictException("Phone already exists!");
        }

        String password = passwordEncoder.encode(userRegisterDTO.getPassword());
        UserEntity userCreate = DTOToEntity.UserResponseToEntity(userRegisterDTO);
        userCreate.setStatus(StatusEnum.VERIFY);
        userCreate.setPassword(password);
        userRepository.save(userCreate);

        return EntityToDTO.UserEntityToDTO(userCreate);
    }


    @Override
    public JwtResponse authenticateUser(LoginDTO loginDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );
            UserEntity userEntity = userRepository.findByEmail(loginDto.getUsername()).orElseThrow(
                    () -> new NotFoundException("user not found")
            );
            if(userEntity.getStatus().equals("BAN")){
                new ActionFailedException("CAN_LOGIN","your account has baned");
            }else if(userEntity.getStatus().equals("DELETED")){
                new ActionFailedException("CAN_LOGIN","your account has delete");
            }else if(userEntity.getStatus().equals("VERIFY")){
                new ActionFailedException("CAN_LOGIN","your account not verify please verify account");
            }
            String token = jwtService.generateToken(authentication);
            return new JwtResponse(token);
        } catch (Exception e) {
            throw new AuthFailedException(e.getMessage());
        }

    }
}
package sms.swp391.services;

import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.requests.LoginDTO;
import sms.swp391.models.dtos.requests.UserRegisterDTO;
import sms.swp391.models.dtos.respones.JwtResponse;
import sms.swp391.models.dtos.respones.UserResponse;

@Service
public interface AuthService {
    JwtResponse authenticateUser(LoginDTO loginDto);
    UserResponse registerUser(UserRegisterDTO userRegisterDTO);
}

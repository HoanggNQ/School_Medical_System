package sms.swp391.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.requests.LoginDTO;
import sms.swp391.models.dtos.requests.UserRegisterDTO;
import sms.swp391.models.dtos.responses.JwtResponse;
import sms.swp391.models.dtos.responses.UserResponse;

@Service
public interface AuthService {
    JwtResponse authenticateUser(LoginDTO loginDto);
    UserResponse registerUser(UserRegisterDTO userRegisterDTO);
}

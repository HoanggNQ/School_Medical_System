package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import sms.swp391.models.dtos.enums.StatusEnum;
import sms.swp391.models.dtos.requests.*;

import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.ActionFailedException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.UserRepository;

import java.time.LocalDate;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DTOToEntity {

    private final UserRepository userRepository;
    public static UserEntity UserResponseToEntity(UserRegisterDTO userRegister) {
        if(userRegister == null) {
            throw new ActionFailedException("User empty");
        }
        return UserEntity.builder()
                .username(userRegister.getUsername())
                .address(userRegister.getAddress())
                .gender(userRegister.getGender())
                .phoneNumber(userRegister.getPhoneNumber())
                .dob(userRegister.getDob())
                .email(userRegister.getEmail())
                .fullname(userRegister.getFullname())
                .build();
    }


}

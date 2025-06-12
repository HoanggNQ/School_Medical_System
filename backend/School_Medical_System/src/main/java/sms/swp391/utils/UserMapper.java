package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.UserRegisterDTO;
import sms.swp391.models.dtos.respones.UserResponse;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.ActionFailedException;

@RequiredArgsConstructor
public class UserMapper {
    public static UserResponse toDTO(UserEntity entity) {
        if (entity == null) return null;

        return UserResponse.builder()
                .userId(entity.getUserId())
                .userName(entity.getUsername())
                .gender(entity.getGender())
                .phoneNumber(entity.getPhoneNumber())
                .dob(entity.getDob())
                .email(entity.getEmail())
                .fullName(entity.getFullname())
                .status(entity.getStatus().toString())
                .build();
    }
    public static UserEntity toEntity(UserRegisterDTO request) {
        if (request == null) return null;

        return UserEntity.builder()
                .username(request.getUsername())
                .fullname(request.getFullname())
                .address(request.getAddress())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .dob(request.getDob())
                .gender(request.getGender())
                .password(request.getPassword()) // You should hash this elsewhere!
                .build();
    }

    public static UserEntity fromRegisterDTO(UserRegisterDTO dto) {
        if (dto == null) throw new ActionFailedException("User empty");

        return UserEntity.builder()
                .username(dto.getUsername())
                .address(dto.getAddress())
                .gender(dto.getGender())
                .roleName(dto.getRoleName())
                .phoneNumber(dto.getPhoneNumber())
                .dob(dto.getDob())
                .email(dto.getEmail())
                .fullname(dto.getFullname())
                .build();
    }
}
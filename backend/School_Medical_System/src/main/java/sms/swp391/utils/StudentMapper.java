package sms.swp391.utils;

import org.springframework.stereotype.Component;
import sms.swp391.models.dtos.responses.StudentGetResponse;
import sms.swp391.models.dtos.responses.StudentHealthEventResponseDTO;
import sms.swp391.models.dtos.responses.StudentResponse;
import sms.swp391.models.entities.*;
import sms.swp391.repositories.StudentHealthEventProjection;
@Component
public class StudentMapper {
    public static StudentHealthEventResponseDTO toHealthEventDTO(StudentHealthEventProjection p) {
        if (p == null) return null;

        return StudentHealthEventResponseDTO.builder()
                .type(mapType(p.getType()))
                .campaignId(p.getCampaignId())
                .campaignName(p.getCampaignName())
                .consentId(p.getConsentId())
                .consentStatus(p.getConsentStatus())
                .consentStatusText(mapConsentStatusText(p.getConsentStatus()))
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .studentName(p.getStudentName())
                .location(p.getLocation())
                .resultStatus(mapResultStatusText(p.getResultStatus()))
                .build();
    }

    private static String mapConsentStatusText(String status) {
        if (status == null) return "Không rõ";
        return switch (status) {
            case "PENDING" -> "Chưa phản hồi";
            case "APPROVED" -> "Đồng ý";
            case "REJECTED" -> "Từ chối";
            default -> "Không rõ";
        };
    }

    private static String mapResultStatusText(String status) {
        if (status == null) return "Chưa có kết quả";
        return switch (status) {
            case "PENDING" -> "Chưa phản hồi";
            case "APPROVED" -> "Đồng ý";
            case "REJECTED" -> "Từ chối";
            default -> "Chưa có kết quả";
        };
    }

    private static String mapType(String type) {
        if (type == null) return "Khác";
        return switch (type) {
            case "HEALTH_CHECK" -> "Khám sức khỏe";
            case "VACCINATION" -> "Tiêm chủng";
            default -> "Khác";
        };
    }

    public static StudentResponse toDTO(StudentEntity entity) {
        if (entity == null) return null;


        return StudentResponse.builder()
                .id(entity.getId())
                .user(UserMapper.toDTO(entity.getUser()))
                .classId(entity.getClassEntity() != null ? entity.getClassEntity().getId() : null)
                .className(entity.getClassEntity() != null ? entity.getClassEntity().getClassName() : null)
                .parentId(entity.getParent() != null ? entity.getParent().getUserId() : null)
                .parentName(entity.getParent() != null ? entity.getParent().getFullname() : null)
                .studentCode(entity.getStudentCode())
                .avatarUrl(entity.getUser() != null ? entity.getUser().getAvatarurl() : null)
                .build();
    }

    public static StudentGetResponse toStudentGetResponse(StudentEntity student) {
        if (student == null || student.getUser() == null) return null;

        UserEntity user = student.getUser();
        UserEntity parent = student.getParent();

        return StudentGetResponse.builder()
                .studentId(student.getId())
                .fullName(user.getFullname())
                .parentID(parent != null ? String.valueOf(parent.getUserId()) : null)
                .parentName(parent != null ? parent.getFullname() : null)
                .dob(user.getDob() != null ? user.getDob().toString() : null)
                .gender(user.getGender())
                .className(student.getClassEntity() != null ? student.getClassEntity().getClassName() : null)
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .studentCode(student.getStudentCode())
                .avatarUrl(user.getAvatarurl())
                .build();
    }
}

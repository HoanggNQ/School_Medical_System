package sms.swp391.models.dtos.responses;

import lombok.*;

@Data
@AllArgsConstructor
public class UserDashboardStatsDTO {
    private Long totalUsers;
    private Long totalStudents;
    private Long totalParents;
    private Long totalNurses;
    private Long totalAdmins;

    private Long active;
    private Long verify;
    private Long ban;
    private Long deleted;
}

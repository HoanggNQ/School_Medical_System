package sms.swp391.models.dtos.respones;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaginatedStudentResponse {
    private List<StudentGetResponse> students;
    private long totalElements;
    private int totalPages;
    private int currentPage;
}
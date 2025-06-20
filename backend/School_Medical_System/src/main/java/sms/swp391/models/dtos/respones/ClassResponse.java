package sms.swp391.models.dtos.respones;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class ClassResponse {
    private Long id;

    private String className;

    private Integer grade;

    private Integer totalstudent;
}

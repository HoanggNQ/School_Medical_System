package sms.swp391.models.dtos.responses;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@Builder
public class ResponseObject {
    private String code;
    private String message;
    private Object data;
    private HttpStatus status;
    private boolean isSuccess;
} 
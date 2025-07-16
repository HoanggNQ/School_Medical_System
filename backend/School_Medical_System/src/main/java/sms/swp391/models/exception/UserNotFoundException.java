package sms.swp391.models.exception;

import org.springframework.http.HttpStatus;
import sms.swp391.models.dtos.responses.ResponseObject;

public class UserNotFoundException extends SchoolMedicalSystemException {
    public UserNotFoundException(String message) {
        super(message);
        this.errorResponse = ResponseObject.builder()
                .code("NOT_FOUND")
                .message(message)
                .data(null)
                .isSuccess(false)
                .status(HttpStatus.NOT_FOUND)
                .build();
    }
}

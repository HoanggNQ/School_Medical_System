package sms.swp391.models.exception;

import org.springframework.http.HttpStatus;
import sms.swp391.models.dtos.respones.ResponseObject;

public class ConflictException extends SchoolMedicalSystemException {
    public ConflictException(String message) {
        super(message);
        this.errorResponse = ResponseObject.builder()
                .code("CONFLICT")
                .message(message)
                .data(null)
                .isSuccess(false)
                .status(HttpStatus.OK)
                .build();
    }
}

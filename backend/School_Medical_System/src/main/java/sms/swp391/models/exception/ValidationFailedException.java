package sms.swp391.models.exception;

import org.springframework.http.HttpStatus;
import sms.swp391.models.dtos.respones.ResponseObject;

public class ValidationFailedException  extends SchoolMedicalSystemException {
    public ValidationFailedException(String message) {
        super(message);
        this.errorResponse = ResponseObject.builder()
                .code("Validation_Failed")
                .message(message)
                .data(null)
                .isSuccess(false)
                .status(HttpStatus.OK)
                .build();
    }
}

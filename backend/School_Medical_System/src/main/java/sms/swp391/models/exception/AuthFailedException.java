package sms.swp391.models.exception;

import org.springframework.http.HttpStatus;
import sms.swp391.models.dtos.respones.ResponseObject;

public class AuthFailedException extends SchoolMedicalSystemException {
    public AuthFailedException(final String message) {
    super(message);
        this.errorResponse = ResponseObject.builder()
            .code("AUTH_FAILED")
                .message(message)
                .data(null)
                .isSuccess(false)
                .status(HttpStatus.UNAUTHORIZED)
                .build();
}
}
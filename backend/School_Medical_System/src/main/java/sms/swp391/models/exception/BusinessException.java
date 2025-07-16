package sms.swp391.models.exception;

import org.springframework.http.HttpStatus;
import sms.swp391.models.dtos.responses.ResponseObject;

public class BusinessException extends SchoolMedicalSystemException {
    public BusinessException(String message) {
        super(message);
        this.errorResponse = ResponseObject.builder()
                .code("BUSINESS_ERROR")
                .message(message)
                .data(null)
                .isSuccess(false)
                .status(HttpStatus.BAD_REQUEST)
                .build();
    }
}

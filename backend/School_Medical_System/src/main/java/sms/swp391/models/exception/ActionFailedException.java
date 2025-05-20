package sms.swp391.models.exception;

import org.springframework.http.HttpStatus;
import sms.swp391.models.dtos.respones.ResponseObject;

public class ActionFailedException extends SchoolMedicalSystemException {
    public ActionFailedException(String message) {
        super(message);
        this.errorResponse = ResponseObject.builder()
                .code("ACTION_FAILED")
                .message(message)
                .data(null)
                .isSuccess(false)
                .status(HttpStatus.OK)
                .build();
    }

    public ActionFailedException(String code,String message) {
        super(message);
        this.errorResponse = ResponseObject.builder()
                .code(code)
                .data(null)
                .message(message)
                .isSuccess(false)
                .status(HttpStatus.OK)
                .build();
    }
}

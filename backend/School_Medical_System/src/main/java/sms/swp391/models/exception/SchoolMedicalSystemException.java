package sms.swp391.models.exception;


import lombok.Getter;
import sms.swp391.models.dtos.responses.ResponseObject;
@Getter
public class SchoolMedicalSystemException extends RuntimeException {
    protected ResponseObject errorResponse;

    protected SchoolMedicalSystemException(String message) {
        super(message);
    }
}

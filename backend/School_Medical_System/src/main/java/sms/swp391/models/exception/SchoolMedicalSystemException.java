package sms.swp391.models.exception;


import sms.swp391.models.dtos.respones.ResponseObject;

public class SchoolMedicalSystemException extends RuntimeException {
    protected ResponseObject errorResponse;

    protected SchoolMedicalSystemException(String message) {
        super(message);
    }

    public ResponseObject getErrorResponse() {
        return errorResponse;
    }
}

package sms.swp391.models.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import sms.swp391.models.dtos.responses.ResponseObject;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SchoolMedicalSystemException.class)
    public ResponseEntity<?> handleSchoolMedicalSystemException(SchoolMedicalSystemException ex) {
        return ResponseEntity
                .status(ex.getErrorResponse().getStatus())
                .body(ex.getErrorResponse());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<?> handleBusinessException(BusinessException ex) {
        return ResponseEntity
                .badRequest()
                .body(ResponseObject.builder()
                        .code("BUSINESS_ERROR")
                        .message(ex.getMessage())
                        .data(null)
                        .isSuccess(false)
                        .status(org.springframework.http.HttpStatus.BAD_REQUEST)
                        .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleUnexpected(Exception ex) {
        ex.printStackTrace(); // Log lỗi ở backend
        return ResponseEntity
                .internalServerError()
                .body(ResponseObject.builder()
                        .code("INTERNAL_SERVER_ERROR")
                        .message("Lỗi hệ thống: " + ex.getMessage())
                        .data(null)
                        .isSuccess(false)
                        .status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                        .build());
    }
}

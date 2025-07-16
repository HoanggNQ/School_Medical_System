package sms.swp391.models.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import sms.swp391.models.dtos.responses.ResponseObject;

/**
 * Xử lý tất cả các exception một cách tập trung và chuẩn REST.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Xử lý tất cả exception custom kế thừa từ SchoolMedicalSystemException,
     * bao gồm: NotFoundException, ValidationFailedException, AuthFailedException, ...
     */
    @ExceptionHandler(SchoolMedicalSystemException.class)
    public ResponseEntity<ResponseObject> handleSchoolMedicalSystemException(SchoolMedicalSystemException ex) {
        return ResponseEntity
                .status(ex.getErrorResponse().getStatus())
                .body(ex.getErrorResponse());
    }

    /**
     * Xử lý lỗi logic nghiệp vụ không kế thừa SMSException (nếu vẫn còn dùng kiểu này).
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ResponseObject> handleBusinessException(BusinessException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ResponseObject.builder()
                        .code("BUSINESS_ERROR")
                        .message(ex.getMessage())
                        .data(null)
                        .isSuccess(false)
                        .status(HttpStatus.BAD_REQUEST)
                        .build());
    }

    /**
     * Xử lý tất cả lỗi chưa xác định (NullPointerException, SQL lỗi, ...).
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseObject> handleUnexpected(Exception ex) {
        ex.printStackTrace(); // Ghi log ở backend
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResponseObject.builder()
                        .code("INTERNAL_SERVER_ERROR")
                        .message("Lỗi hệ thống: " + ex.getMessage())
                        .data(null)
                        .isSuccess(false)
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .build());
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseObject> handleValidationErrors(MethodArgumentNotValidException ex) {
        String firstError = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .orElse("Dữ liệu không hợp lệ");

        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ResponseObject.builder()
                        .code("VALIDATION_ERROR")
                        .message(firstError)
                        .data(null)
                        .isSuccess(false)
                        .status(HttpStatus.UNPROCESSABLE_ENTITY)
                        .build());
    }

}

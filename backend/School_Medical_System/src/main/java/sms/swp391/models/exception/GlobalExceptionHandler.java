package sms.swp391.models.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import sms.swp391.models.dtos.responses.ResponseObject;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ✅ Xử lý lỗi @Valid trong @RequestBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseObject> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage()) // lấy thông báo đã khai báo trong @NotBlank(message = ...)
                .collect(Collectors.joining(", "));

        return ResponseEntity.badRequest().body(
                ResponseObject.builder()
                        .code("VALIDATION_FAILED")
                        .message(errorMessage)
                        .status(HttpStatus.BAD_REQUEST)
                        .isSuccess(false)
                        .data(null)
                        .build()
        );
    }

    // ✅ Xử lý lỗi @Valid trong @PathVariable hoặc @RequestParam
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ResponseObject> handleConstraintViolation(ConstraintViolationException ex) {
        String errorMessage = ex.getConstraintViolations()
                .stream()
                .map(cv -> cv.getMessage())
                .collect(Collectors.joining(", "));

        return ResponseEntity.badRequest().body(
                ResponseObject.builder()
                        .code("CONSTRAINT_VIOLATION")
                        .message(errorMessage)
                        .status(HttpStatus.BAD_REQUEST)
                        .isSuccess(false)
                        .data(null)
                        .build()
        );
    }

    // ✅ Xử lý các lỗi còn lại (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseObject> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                        .code("INTERNAL_SERVER_ERROR")
                        .message("Lỗi hệ thống: " + ex.getMessage())
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .isSuccess(false)
                        .data(null)
                        .build()
        );
    }
}

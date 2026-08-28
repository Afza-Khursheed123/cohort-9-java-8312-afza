package com.contactmanager.backend.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.contactmanager.backend.controller.AuthenticationController;
import com.contactmanager.backend.controller.UserProfileController;

@RestControllerAdvice(assignableTypes = { AuthenticationController.class, UserProfileController.class })
public class AuthenticationExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials() {
        return error(HttpStatus.UNAUTHORIZED, "Email/phone number or password is incorrect", Map.of());
    }

    @ExceptionHandler(InvalidCurrentPasswordException.class)
    public ResponseEntity<ApiError> handleInvalidCurrentPassword(InvalidCurrentPasswordException exception) {
        return error(HttpStatus.BAD_REQUEST, exception.getMessage(),
                Map.of("currentPassword", exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(fieldError -> {
            String field = switch (fieldError.getField()) {
                case "newPasswordWithinBcryptLimit" -> "newPassword";
                case "newPasswordsMatching" -> "confirmNewPassword";
                default -> fieldError.getField();
            };
            errors.putIfAbsent(field, fieldError.getDefaultMessage());
        });
        return error(HttpStatus.BAD_REQUEST, "Please correct the highlighted fields", errors);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiError> handleMissingAuthenticatedUser() {
        return error(HttpStatus.UNAUTHORIZED, "Authentication is no longer valid", Map.of());
    }

    private ResponseEntity<ApiError> error(HttpStatus status, String message, Map<String, String> errors) {
        return ResponseEntity.status(status)
                .body(new ApiError(Instant.now(), status.value(), message, errors));
    }
}

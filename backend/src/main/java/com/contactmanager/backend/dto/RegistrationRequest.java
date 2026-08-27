package com.contactmanager.backend.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(
        @NotBlank(message = "First name is required")
        @Size(max = 100, message = "First name must not exceed 100 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 100, message = "Last name must not exceed 100 characters")
        String lastName,

        @Email(message = "Email address is invalid")
        @Size(max = 254, message = "Email must not exceed 254 characters")
        String email,

        @Pattern(regexp = "^\\+?[1-9]\\d{7,14}$", message = "Phone number must contain 8 to 15 digits and may start with +")
        String phone,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters")
        String password) {

    @AssertTrue(message = "Provide either an email address or a phone number, but not both")
    public boolean isExactlyOneIdentifierProvided() {
        return hasText(email) ^ hasText(phone);
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}

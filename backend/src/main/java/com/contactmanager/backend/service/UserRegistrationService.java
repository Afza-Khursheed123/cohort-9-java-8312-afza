package com.contactmanager.backend.service;

import java.util.Locale;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.contactmanager.backend.dto.RegistrationRequest;
import com.contactmanager.backend.dto.RegistrationResponse;
import com.contactmanager.backend.entity.User;
import com.contactmanager.backend.entity.User.IdentifierType;
import com.contactmanager.backend.exception.RegistrationPersistenceException;

@Service
public class UserRegistrationService {

    private final UserRegistrationWriter registrationWriter;
    private final PasswordEncoder passwordEncoder;

    public UserRegistrationService(UserRegistrationWriter registrationWriter, PasswordEncoder passwordEncoder) {
        this.registrationWriter = registrationWriter;
        this.passwordEncoder = passwordEncoder;
    }

    public RegistrationResponse register(RegistrationRequest request) {
        boolean usesEmail = request.email() != null && !request.email().isBlank();
        String identifier = usesEmail
                ? request.email().trim().toLowerCase(Locale.ROOT)
                : request.phone().trim();

        User user = new User(
                request.firstName().trim(),
                request.lastName().trim(),
                identifier,
                usesEmail ? IdentifierType.EMAIL : IdentifierType.PHONE,
                passwordEncoder.encode(request.password()));

        try {
            registrationWriter.insert(user);
            return registrationAccepted();
        } catch (DataIntegrityViolationException exception) {
            if (violatesIdentifierConstraint(exception)) {
                return registrationAccepted();
            }
            throw persistenceFailure(exception);
        } catch (DataAccessException exception) {
            throw persistenceFailure(exception);
        }
    }

    private boolean violatesIdentifierConstraint(DataIntegrityViolationException exception) {
        Throwable cause = exception;
        while (cause != null) {
            if (cause instanceof ConstraintViolationException constraintViolation
                    && "uk_users_identifier".equalsIgnoreCase(constraintViolation.getConstraintName())) {
                return true;
            }
            cause = cause.getCause();
        }
        return false;
    }

    private RegistrationResponse registrationAccepted() {
        return new RegistrationResponse(
                null,
                null,
                null,
                null,
                null,
                "If the provided contact information is eligible, registration has been accepted");
    }

    private RegistrationPersistenceException persistenceFailure(DataAccessException cause) {
        return new RegistrationPersistenceException("Unable to persist registration", cause);
    }
}

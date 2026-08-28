package com.contactmanager.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.TransientDataAccessResourceException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.contactmanager.backend.dto.RegistrationRequest;
import com.contactmanager.backend.dto.RegistrationResponse;
import com.contactmanager.backend.entity.User;
import com.contactmanager.backend.exception.RegistrationPersistenceException;
import com.contactmanager.backend.repository.UserRepository;

class UserRegistrationServiceTests {

    private UserRepository userRepository;
    private UserRegistrationWriter registrationWriter;
    private UserRegistrationService service;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        registrationWriter = mock(UserRegistrationWriter.class);
        service = new UserRegistrationService(userRepository, registrationWriter, new BCryptPasswordEncoder());
    }

    @Test
    void returnsSameResponseForNewAndExistingIdentifiers() {
        RegistrationRequest request = request();
        when(userRepository.existsByIdentifier("user@example.com"))
                .thenReturn(false)
                .thenReturn(true);
        RegistrationResponse newIdentifierResponse = service.register(request);
        RegistrationResponse existingIdentifierResponse = service.register(request);

        assertThat(existingIdentifierResponse).isEqualTo(newIdentifierResponse);
        assertThat(newIdentifierResponse.id()).isNull();
        assertThat(newIdentifierResponse.email()).isNull();
        assertThat(newIdentifierResponse.phone()).isNull();
    }

    @Test
    void returnsGenericAcceptedResponseWhenUniqueConstraintDetectsDuplicate() {
        when(userRepository.existsByIdentifier("user@example.com")).thenReturn(false);
        ConstraintViolationException constraintViolation = new ConstraintViolationException(
                "duplicate", null, "uk_users_identifier");
        doThrow(new DataIntegrityViolationException("duplicate", constraintViolation))
                .when(registrationWriter).insert(any(User.class));

        RegistrationResponse response = service.register(request());

        assertThat(response.message())
                .isEqualTo("If the provided contact information is eligible, registration has been accepted");
    }

    @Test
    void rejectsIntegrityViolationsForOtherConstraints() {
        when(userRepository.existsByIdentifier("user@example.com")).thenReturn(false);
        ConstraintViolationException constraintViolation = new ConstraintViolationException(
                "required value missing", null, "another_constraint");
        doThrow(new DataIntegrityViolationException("invalid", constraintViolation))
                .when(registrationWriter).insert(any(User.class));

        assertThatThrownBy(() -> service.register(request()))
                .isInstanceOf(RegistrationPersistenceException.class)
                .hasMessage("Unable to persist registration");
    }

    @Test
    void preservesPersistenceFailureHandling() {
        when(userRepository.existsByIdentifier("user@example.com"))
                .thenThrow(new TransientDataAccessResourceException("unavailable"));

        assertThatThrownBy(() -> service.register(request()))
                .isInstanceOf(RegistrationPersistenceException.class)
                .hasMessage("Unable to persist registration");
        verify(registrationWriter, never()).insert(any(User.class));
    }

    private RegistrationRequest request() {
        return new RegistrationRequest("Test", "User", "User@Example.com", null, "valid-password");
    }
}

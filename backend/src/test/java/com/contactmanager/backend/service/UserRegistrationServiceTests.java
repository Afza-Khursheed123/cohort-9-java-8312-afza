package com.contactmanager.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.TransientDataAccessResourceException;

import com.contactmanager.backend.dto.RegistrationRequest;
import com.contactmanager.backend.dto.RegistrationResponse;
import com.contactmanager.backend.entity.User;
import com.contactmanager.backend.exception.RegistrationPersistenceException;
import com.contactmanager.backend.repository.UserRepository;

class UserRegistrationServiceTests {

    private UserRepository userRepository;
    private UserRegistrationService service;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        service = new UserRegistrationService(userRepository);
    }

    @Test
    void returnsSameResponseForNewAndExistingIdentifiers() {
        RegistrationRequest request = request();
        when(userRepository.existsByIdentifier("user@example.com"))
                .thenReturn(false)
                .thenReturn(true);
        when(userRepository.saveAndFlush(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

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
        when(userRepository.saveAndFlush(any(User.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate"));

        RegistrationResponse response = service.register(request());

        assertThat(response.message())
                .isEqualTo("If the provided contact information is eligible, registration has been accepted");
    }

    @Test
    void preservesPersistenceFailureHandling() {
        when(userRepository.existsByIdentifier("user@example.com"))
                .thenThrow(new TransientDataAccessResourceException("unavailable"));

        assertThatThrownBy(() -> service.register(request()))
                .isInstanceOf(RegistrationPersistenceException.class)
                .hasMessage("Unable to persist registration");
        verify(userRepository, never()).saveAndFlush(any(User.class));
    }

    private RegistrationRequest request() {
        return new RegistrationRequest("Test", "User", "User@Example.com", null, "valid-password");
    }
}

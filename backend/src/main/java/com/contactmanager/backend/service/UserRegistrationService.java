package com.contactmanager.backend.service;

import java.util.Locale;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.contactmanager.backend.dto.RegistrationRequest;
import com.contactmanager.backend.dto.RegistrationResponse;
import com.contactmanager.backend.entity.User;
import com.contactmanager.backend.entity.User.IdentifierType;
import com.contactmanager.backend.exception.DuplicateUserException;
import com.contactmanager.backend.exception.RegistrationPersistenceException;
import com.contactmanager.backend.repository.UserRepository;

@Service
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserRegistrationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public RegistrationResponse register(RegistrationRequest request) {
        boolean usesEmail = request.email() != null && !request.email().isBlank();
        String identifier = usesEmail
                ? request.email().trim().toLowerCase(Locale.ROOT)
                : request.phone().trim();

        try {
            if (userRepository.existsByIdentifier(identifier)) {
                throw duplicate();
            }
        } catch (DataAccessException exception) {
            throw persistenceFailure(exception);
        }

        User user = new User(
                request.firstName().trim(),
                request.lastName().trim(),
                identifier,
                usesEmail ? IdentifierType.EMAIL : IdentifierType.PHONE,
                passwordEncoder.encode(request.password()));

        try {
            User saved = userRepository.saveAndFlush(user);
            return new RegistrationResponse(
                    saved.getId(),
                    saved.getFirstName(),
                    saved.getLastName(),
                    usesEmail ? saved.getIdentifier() : null,
                    usesEmail ? null : saved.getIdentifier(),
                    "Registration successful");
        } catch (DataIntegrityViolationException exception) {
            throw duplicate();
        } catch (DataAccessException exception) {
            throw persistenceFailure(exception);
        }
    }

    private DuplicateUserException duplicate() {
        return new DuplicateUserException("An account with the provided contact information already exists");
    }

    private RegistrationPersistenceException persistenceFailure(DataAccessException cause) {
        return new RegistrationPersistenceException("Unable to persist registration", cause);
    }
}

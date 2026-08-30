package com.contactmanager.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.contactmanager.backend.dto.LoginRequest;
import com.contactmanager.backend.dto.UserProfileResponse;
import com.contactmanager.backend.service.AuthenticatedUser;
import com.contactmanager.backend.service.UserAuthenticationService;
import com.contactmanager.backend.service.UserProfileService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final UserProfileService profileService;

    public AuthenticationController(AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository,
            UserProfileService profileService) {
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.profileService = profileService;
    }

    @PostMapping("/login")
    public UserProfileResponse login(@Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request, HttpServletResponse response, CsrfToken csrfToken) {
        csrfToken.getToken();
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(
                        UserAuthenticationService.normalizeIdentifier(loginRequest.identifier()),
                        loginRequest.password()));

        HttpSession existingSession = request.getSession(false);
        if (existingSession != null) {
            request.changeSessionId();
        }
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);
        Long userId = principal(authentication).userId();
        UserProfileResponse profile = profileService.getProfile(userId);
        logger.info("User logged in successfully: userId={}", userId);
        return profile;
    }

    @GetMapping("/session")
    public UserProfileResponse session(Authentication authentication, CsrfToken csrfToken) {
        csrfToken.getToken();
        return profileService.getProfile(principal(authentication).userId());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, Authentication authentication) {
        Long userId = authentication != null && authentication.getPrincipal() instanceof AuthenticatedUser user
                ? user.userId()
                : null;
        HttpSession session = request.getSession(false);
        SecurityContextHolder.clearContext();
        if (session != null) {
            session.invalidate();
        }
        logger.info("User logged out successfully: userId={}", userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    static AuthenticatedUser principal(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new IllegalStateException("Authenticated principal is unavailable");
        }
        return user;
    }
}

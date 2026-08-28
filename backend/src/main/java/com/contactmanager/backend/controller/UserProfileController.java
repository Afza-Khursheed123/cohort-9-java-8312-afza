package com.contactmanager.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.contactmanager.backend.dto.ChangePasswordRequest;
import com.contactmanager.backend.dto.UserProfileResponse;
import com.contactmanager.backend.service.AuthenticatedUser;
import com.contactmanager.backend.service.UserProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users/me")
public class UserProfileController {

    private final UserProfileService profileService;

    public UserProfileController(UserProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public UserProfileResponse profile(Authentication authentication) {
        return profileService.getProfile(principal(authentication).userId());
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        profileService.changePassword(principal(authentication).userId(), request);
        return ResponseEntity.noContent().build();
    }

    private AuthenticatedUser principal(Authentication authentication) {
        return AuthenticationController.principal(authentication);
    }
}

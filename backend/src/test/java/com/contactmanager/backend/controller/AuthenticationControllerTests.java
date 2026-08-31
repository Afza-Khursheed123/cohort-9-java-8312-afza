package com.contactmanager.backend.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;

import com.contactmanager.backend.dto.LoginRequest;
import com.contactmanager.backend.dto.UserProfileResponse;
import com.contactmanager.backend.service.AuthenticatedUser;
import com.contactmanager.backend.service.UserProfileService;

class AuthenticationControllerTests {

    private AuthenticationManager authenticationManager;
    private SecurityContextRepository contextRepository;
    private UserProfileService profileService;
    private AuthenticationController controller;

    @BeforeEach
    void setUp() {
        authenticationManager = mock(AuthenticationManager.class);
        contextRepository = mock(SecurityContextRepository.class);
        profileService = mock(UserProfileService.class);
        controller = new AuthenticationController(authenticationManager, contextRepository, profileService);
    }

    @Test
    void successfulLoginNormalizesIdentifierSavesSessionContextAndReturnsProfile() {
        AuthenticatedUser principal = new AuthenticatedUser(7L, "user@example.com", "hash");
        Authentication authenticated = UsernamePasswordAuthenticationToken.authenticated(principal, null, principal.getAuthorities());
        when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(authenticated);
        UserProfileResponse profile = new UserProfileResponse(7L, "Test", "User", "user@example.com", null);
        when(profileService.getProfile(7L)).thenReturn(profile);
        CsrfToken csrfToken = mock(CsrfToken.class);
        when(csrfToken.getToken()).thenReturn("token");
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        UserProfileResponse result = controller.login(
                new LoginRequest(" User@Example.com ", "password"), request, response, csrfToken);

        assertThat(result).isEqualTo(profile);
        verify(authenticationManager).authenticate(eq(
                UsernamePasswordAuthenticationToken.unauthenticated("user@example.com", "password")));
        verify(contextRepository).saveContext(any(), eq(request), eq(response));
        verify(profileService).getProfile(7L);
    }

    @Test
    void invalidLoginPropagatesAuthenticationFailureForApiHandler() {
        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThatThrownBy(() -> controller.login(
                new LoginRequest("user@example.com", "wrong-password"),
                new MockHttpServletRequest(), new MockHttpServletResponse(), mock(CsrfToken.class)))
                .isInstanceOf(BadCredentialsException.class);

        assertThat(new com.contactmanager.backend.exception.AuthenticationExceptionHandler()
                .handleBadCredentials().getStatusCode().value()).isEqualTo(401);
    }

    @Test
    void logoutInvalidatesExistingSessionAndReturnsNoContent() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpSession session = (MockHttpSession) request.getSession();
        AuthenticatedUser principal = new AuthenticatedUser(7L, "user@example.com", "hash");
        Authentication authentication = UsernamePasswordAuthenticationToken.authenticated(
                principal, null, principal.getAuthorities());

        assertThat(controller.logout(request, authentication).getStatusCode().value()).isEqualTo(204);
        assertThat(session.isInvalid()).isTrue();
    }
}

package com.contactmanager.backend.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.contactmanager.backend.repository.UserRepository;
import com.contactmanager.backend.repository.ContactRepository;

@SpringBootTest
@AutoConfigureMockMvc
class RegistrationAuthenticationIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

    @BeforeEach
    void clearUsers() {
        contactRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void emailRegistrationCreatesAuthenticatedSessionWithAccessToProtectedEndpoints() throws Exception {
        MockHttpSession session = register("""
                {"firstName":"Ada","lastName":"Lovelace","email":"Ada@Example.com","password":"password123"}
                """);

        mockMvc.perform(get("/api/auth/session").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("ada@example.com"))
                .andExpect(jsonPath("$.phone").value(nullValue()));
        mockMvc.perform(get("/api/contacts").session(session))
                .andExpect(status().isOk());
    }

    @Test
    void phoneRegistrationCreatesAuthenticatedSession() throws Exception {
        MockHttpSession session = register("""
                {"firstName":"Grace","lastName":"Hopper","phone":"+923001234567","password":"password123"}
                """);

        mockMvc.perform(get("/api/users/me").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phone").value("+923001234567"))
                .andExpect(jsonPath("$.email").value(nullValue()));
    }

    @Test
    void duplicateRegistrationCannotAuthenticateAsExistingUser() throws Exception {
        register("""
                {"firstName":"Existing","lastName":"User","email":"existing@example.com","password":"original-password"}
                """);

        MvcResult duplicate = mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"firstName":"Attacker","lastName":"User","email":"existing@example.com","password":"attacker-password"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value(
                        "If the provided contact information is eligible, registration has been accepted"))
                .andReturn();

        assertThat(duplicate.getRequest().getSession(false)).isNull();
    }

    @Test
    void invalidRegistrationDoesNotAuthenticateRequester() throws Exception {
        MvcResult invalid = mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"firstName":"","lastName":"User","email":"invalid","password":"short"}
                                """))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertThat(invalid.getRequest().getSession(false)).isNull();
    }

    private MockHttpSession register(String body) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value(
                        "If the provided contact information is eligible, registration has been accepted"))
                .andReturn();
        return (MockHttpSession) result.getRequest().getSession(false);
    }
}

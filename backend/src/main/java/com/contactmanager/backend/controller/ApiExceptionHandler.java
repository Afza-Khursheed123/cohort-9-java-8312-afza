package com.contactmanager.backend.controller;

import java.net.URI;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(DataAccessException.class)
    public ProblemDetail handleDataAccessException(HttpServletRequest request) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.SERVICE_UNAVAILABLE,
                "The contact data store is temporarily unavailable.");
        problem.setTitle("Contact data unavailable");
        problem.setInstance(URI.create(request.getRequestURI()));
        return problem;
    }
}

package com.esa.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleAll(Exception e) {
        e.printStackTrace(); // Log on server console for debugging
        Map<String, String> error = new HashMap<>();
        String message = e.getMessage() != null ? e.getMessage() : "Unknown Error";
        error.put("message", message);
        error.put("type", e.getClass().getSimpleName());
        
        int status = (e instanceof org.springframework.security.access.AccessDeniedException) ? 403 : 500;
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put("message", error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
}

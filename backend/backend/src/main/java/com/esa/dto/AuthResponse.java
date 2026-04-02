package com.esa.dto;

import com.esa.util.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String team;
    private RoleEnum role;
    private String message;
}

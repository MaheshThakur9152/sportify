package com.sportify.model;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String message;
}
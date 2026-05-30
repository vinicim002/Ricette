package com.vinicius.backend.service;

import com.vinicius.backend.dto.LoginRequest;
import com.vinicius.backend.dto.TokenResponse;
import com.vinicius.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    private final JwtUtil jwtUtil;

    public TokenResponse login(LoginRequest request) {
        if (!adminEmail.equals(request.getEmail()) || !adminPassword.equals(request.getPassword())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        String token = jwtUtil.generateToken(adminEmail);
        return new TokenResponse(token);
    }
}

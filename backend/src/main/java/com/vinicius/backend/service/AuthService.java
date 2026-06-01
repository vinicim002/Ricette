package com.vinicius.backend.service;

import com.vinicius.backend.config.AdminProperties;
import com.vinicius.backend.dto.LoginRequest;
import com.vinicius.backend.dto.TokenResponse;
import com.vinicius.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AdminProperties adminProperties;
    private final JwtUtil jwtUtil;

    public TokenResponse login(LoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";

        boolean emailMatch = adminProperties.getEmail().equalsIgnoreCase(email);
        boolean passwordMatch = adminProperties.getPassword().equals(password);

        if (!emailMatch || !passwordMatch) {
            log.warn("Tentativa de login inválida.");
            throw new BadCredentialsException("Credenciais inválidas");
        }

        String token = jwtUtil.generateToken(adminProperties.getEmail());
        return new TokenResponse(token);
    }
}

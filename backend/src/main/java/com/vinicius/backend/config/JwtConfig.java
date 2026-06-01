package com.vinicius.backend.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class JwtConfig {

    private static final int MIN_SECRET_BYTES = 32;

    private String secret;
    private long expirationMs;

    @PostConstruct
    void validate() {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("app.jwt.secret deve estar configurado.");
        }
        if (secret.getBytes(java.nio.charset.StandardCharsets.UTF_8).length < MIN_SECRET_BYTES) {
            throw new IllegalStateException(
                    "app.jwt.secret deve ter pelo menos " + MIN_SECRET_BYTES + " bytes.");
        }
        if (expirationMs <= 0) {
            throw new IllegalStateException("app.jwt.expiration-ms deve ser maior que zero.");
        }
    }
}

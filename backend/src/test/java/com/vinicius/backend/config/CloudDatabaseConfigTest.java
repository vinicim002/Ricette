package com.vinicius.backend.config;

import org.junit.jupiter.api.Test;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class CloudDatabaseConfigTest {

    @Test
    void parsesPostgresUrl() {
        Optional<CloudDatabaseConfig.JdbcSettings> settings = CloudDatabaseConfig.resolve(env -> switch (env) {
            case "DATABASE_URL" -> "postgresql://user:pass@db.example.com:5432/ricette";
            default -> null;
        });
        assertThat(settings).isPresent();
        assertThat(settings.get().url()).isEqualTo("jdbc:postgresql://db.example.com:5432/ricette");
        assertThat(settings.get().username()).isEqualTo("user");
        assertThat(settings.get().password()).isEqualTo("pass");
    }

    @Test
    void parsesDiscreteVariables() {
        Optional<CloudDatabaseConfig.JdbcSettings> settings = CloudDatabaseConfig.resolve(Map.of(
                "DATABASE_HOST", "db.example.com",
                "DATABASE_PORT", "5432",
                "DATABASE_NAME", "ricette",
                "DATABASE_USER", "ricette",
                "DATABASE_PASSWORD", "secret"
        )::get);
        assertThat(settings).isPresent();
        assertThat(settings.get().url()).isEqualTo("jdbc:postgresql://db.example.com:5432/ricette");
    }
}

package com.vinicius.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

/**
 * DataSource explícito em produção — não depende só do EnvironmentPostProcessor (Spring Boot 4).
 */
@Configuration
@Profile("prod")
public class ProdDataSourceConfiguration {

    @Bean
    @Primary
    public DataSource dataSource() {
        CloudDatabaseConfig.JdbcSettings settings = CloudDatabaseConfig.resolve()
                .orElseThrow(() -> new IllegalStateException(CloudDatabaseConfig.HELP));

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(settings.url());
        if (settings.username() != null && !settings.username().isBlank()) {
            config.setUsername(settings.username());
        }
        if (settings.password() != null) {
            config.setPassword(settings.password());
        }
        config.setDriverClassName("org.postgresql.Driver");
        return new HikariDataSource(config);
    }
}

package com.vinicius.backend.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Converte DATABASE_URL do Render/Heroku (postgres://...) em propriedades JDBC do Spring.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            return;
        }
        if (!databaseUrl.startsWith("postgres")) {
            return;
        }

        try {
            String normalized = databaseUrl.replace("postgres://", "postgresql://");
            URI uri = URI.create(normalized);

            String userInfo = uri.getUserInfo();
            String username = "";
            String password = "";
            if (userInfo != null && !userInfo.isBlank()) {
                int colon = userInfo.indexOf(':');
                if (colon >= 0) {
                    username = decode(userInfo.substring(0, colon));
                    password = decode(userInfo.substring(colon + 1));
                } else {
                    username = decode(userInfo);
                }
            }

            String host = uri.getHost();
            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String database = uri.getPath() != null ? uri.getPath().replaceFirst("^/", "") : "";

            Map<String, Object> props = new HashMap<>();
            props.put("spring.datasource.url", "jdbc:postgresql://" + host + ":" + port + "/" + database);
            props.put("spring.datasource.username", username);
            props.put("spring.datasource.password", password);

            environment.getPropertySources().addFirst(new MapPropertySource("renderDatabaseUrl", props));
        } catch (Exception ex) {
            throw new IllegalStateException("Não foi possível interpretar DATABASE_URL.", ex);
        }
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}

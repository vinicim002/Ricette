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
 * Configura o DataSource em produção a partir de DATABASE_URL (Render/Heroku)
 * ou variáveis DATABASE_* / PG* (Render link / Railway).
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String HELP = """
            Banco de dados não configurado. No Render:
            1. Crie um PostgreSQL no mesmo projeto
            2. No Web Service → Environment → Link Database (ou adicione DATABASE_URL)
            3. Redeploy
            Alternativa: defina SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME e SPRING_DATASOURCE_PASSWORD
            """;

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        if (!isProdProfile(environment)) {
            return;
        }

        if (hasExplicitSpringDatasource(environment)) {
            validateResolvedUrl(environment.getProperty("spring.datasource.url"));
            return;
        }

        Map<String, Object> props = resolveFromDatabaseUrl(environment);
        if (props == null) {
            props = resolveFromDiscreteVariables(environment);
        }

        if (props != null) {
            environment.getPropertySources().addFirst(new MapPropertySource("cloudDatabase", props));
            return;
        }

        throw new IllegalStateException(HELP);
    }

    private static boolean isProdProfile(ConfigurableEnvironment environment) {
        for (String profile : environment.getActiveProfiles()) {
            if ("prod".equals(profile)) {
                return true;
            }
        }
        String profiles = environment.getProperty("spring.profiles.active");
        return profiles != null && profiles.contains("prod");
    }

    private static boolean hasExplicitSpringDatasource(ConfigurableEnvironment environment) {
        String url = environment.getProperty("SPRING_DATASOURCE_URL");
        return url != null && !url.isBlank() && !url.contains("${");
    }

    private static Map<String, Object> resolveFromDatabaseUrl(ConfigurableEnvironment environment) {
        String databaseUrl = firstNonBlank(
                environment.getProperty("DATABASE_URL"),
                environment.getProperty("INTERNAL_DATABASE_URL")
        );
        if (databaseUrl == null || !databaseUrl.startsWith("postgres")) {
            return null;
        }
        return fromPostgresUrl(databaseUrl);
    }

    private static Map<String, Object> resolveFromDiscreteVariables(ConfigurableEnvironment environment) {
        String host = firstNonBlank(
                environment.getProperty("DATABASE_HOST"),
                environment.getProperty("PGHOST")
        );
        String user = firstNonBlank(
                environment.getProperty("DATABASE_USER"),
                environment.getProperty("PGUSER")
        );
        String password = firstNonBlank(
                environment.getProperty("DATABASE_PASSWORD"),
                environment.getProperty("PGPASSWORD")
        );
        String database = firstNonBlank(
                environment.getProperty("DATABASE_NAME"),
                environment.getProperty("PGDATABASE")
        );

        if (host == null || user == null || password == null || database == null) {
            return null;
        }

        String port = firstNonBlank(
                environment.getProperty("DATABASE_PORT"),
                environment.getProperty("PGPORT")
        );
        int portNumber = port != null ? Integer.parseInt(port) : 5432;

        Map<String, Object> props = new HashMap<>();
        props.put("spring.datasource.url", "jdbc:postgresql://" + host + ":" + portNumber + "/" + database);
        props.put("spring.datasource.username", user);
        props.put("spring.datasource.password", password);
        return props;
    }

    private static Map<String, Object> fromPostgresUrl(String databaseUrl) {
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
            return props;
        } catch (Exception ex) {
            throw new IllegalStateException("Não foi possível interpretar DATABASE_URL.", ex);
        }
    }

    private static void validateResolvedUrl(String url) {
        if (url == null || url.isBlank() || url.contains("${")) {
            throw new IllegalStateException(HELP);
        }
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return null;
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}

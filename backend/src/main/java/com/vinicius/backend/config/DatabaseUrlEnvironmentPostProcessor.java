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
            2. No Web Service → Environment → Add from database / Link Database
            3. Confirme a variável DATABASE_URL (postgres://...)
            4. Redeploy
            Alternativa: SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD
            """;

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> props = resolveFromDatabaseUrl(environment);
        if (props == null) {
            props = resolveFromDiscreteVariables(environment);
        }
        if (props == null) {
            props = resolveFromSpringDatasourceEnv(environment);
        }

        if (props != null) {
            environment.getPropertySources().addFirst(new MapPropertySource("cloudDatabase", props));
            return;
        }

        if (isProdProfile(environment)) {
            throw new IllegalStateException(HELP);
        }
    }

    private static boolean isProdProfile(ConfigurableEnvironment environment) {
        for (String profile : environment.getActiveProfiles()) {
            if ("prod".equals(profile)) {
                return true;
            }
        }
        String profiles = firstNonBlank(
                getProperty(environment, "spring.profiles.active"),
                getProperty(environment, "SPRING_PROFILES_ACTIVE")
        );
        return profiles != null && profiles.contains("prod");
    }

    private static Map<String, Object> resolveFromSpringDatasourceEnv(ConfigurableEnvironment environment) {
        String url = getProperty(environment, "SPRING_DATASOURCE_URL");
        String username = getProperty(environment, "SPRING_DATASOURCE_USERNAME");
        String password = getProperty(environment, "SPRING_DATASOURCE_PASSWORD");

        if (url == null || url.isBlank() || url.contains("${")) {
            return null;
        }

        Map<String, Object> props = new HashMap<>();
        props.put("spring.datasource.url", url);
        if (username != null) {
            props.put("spring.datasource.username", username);
        }
        if (password != null) {
            props.put("spring.datasource.password", password);
        }
        return props;
    }

    private static Map<String, Object> resolveFromDatabaseUrl(ConfigurableEnvironment environment) {
        String databaseUrl = firstNonBlank(
                getProperty(environment, "DATABASE_URL"),
                getProperty(environment, "INTERNAL_DATABASE_URL")
        );
        if (databaseUrl == null || !isPostgresUrl(databaseUrl)) {
            return null;
        }
        return fromPostgresUrl(databaseUrl);
    }

    private static Map<String, Object> resolveFromDiscreteVariables(ConfigurableEnvironment environment) {
        String host = firstNonBlank(
                getProperty(environment, "DATABASE_HOST"),
                getProperty(environment, "PGHOST")
        );
        String user = firstNonBlank(
                getProperty(environment, "DATABASE_USER"),
                getProperty(environment, "PGUSER")
        );
        String password = firstNonBlank(
                getProperty(environment, "DATABASE_PASSWORD"),
                getProperty(environment, "PGPASSWORD")
        );
        String database = firstNonBlank(
                getProperty(environment, "DATABASE_NAME"),
                getProperty(environment, "PGDATABASE")
        );

        if (host == null || user == null || password == null || database == null) {
            return null;
        }

        String port = firstNonBlank(
                getProperty(environment, "DATABASE_PORT"),
                getProperty(environment, "PGPORT")
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
            throw new IllegalStateException("Não foi possível interpretar DATABASE_URL: " + maskUrl(databaseUrl), ex);
        }
    }

    private static String maskUrl(String url) {
        if (url == null || url.length() < 12) {
            return "(url)";
        }
        return url.substring(0, 12) + "...";
    }

    private static String getProperty(ConfigurableEnvironment environment, String key) {
        String value = environment.getProperty(key);
        if (value != null && !value.isBlank()) {
            return value.trim();
        }
        value = System.getenv(key);
        if (value != null && !value.isBlank()) {
            return value.trim();
        }
        return null;
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return null;
    }

    private static boolean isPostgresUrl(String url) {
        return url.startsWith("postgres://") || url.startsWith("postgresql://");
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}

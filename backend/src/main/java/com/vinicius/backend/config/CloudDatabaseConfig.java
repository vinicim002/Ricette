package com.vinicius.backend.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.function.Function;

/**
 * Resolve JDBC settings from Render/Heroku-style env vars (reads {@link System#getenv} only).
 */
public final class CloudDatabaseConfig {

    static final String HELP = """
            Banco de dados não configurado. No Render:
            1. Confirme que o Postgres ricette-db está no mesmo Blueprint
            2. No Web Service ricette-api → Environment: DATABASE_URL ou DATABASE_HOST deve existir
            3. Se criou a API manualmente, use Add from database / Link Database
            4. Redeploy
            Alternativa: SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD
            """;

    private CloudDatabaseConfig() {
    }

    public record JdbcSettings(String url, String username, String password) {
    }

    public static Optional<JdbcSettings> resolve() {
        return resolve(System::getenv);
    }

    static Optional<JdbcSettings> resolve(Function<String, String> getenv) {
        JdbcSettings fromUrl = fromDatabaseUrl(getenv);
        if (fromUrl != null) {
            return Optional.of(fromUrl);
        }
        JdbcSettings fromDiscrete = fromDiscreteVariables(getenv);
        if (fromDiscrete != null) {
            return Optional.of(fromDiscrete);
        }
        JdbcSettings fromSpring = fromSpringDatasourceEnv(getenv);
        return fromSpring != null ? Optional.of(fromSpring) : Optional.empty();
    }

    private static JdbcSettings fromSpringDatasourceEnv(Function<String, String> getenv) {
        String url = env(getenv, "SPRING_DATASOURCE_URL");
        if (url == null || url.isBlank() || url.contains("${")) {
            return null;
        }
        return new JdbcSettings(url, env(getenv, "SPRING_DATASOURCE_USERNAME"), env(getenv, "SPRING_DATASOURCE_PASSWORD"));
    }

    private static JdbcSettings fromDatabaseUrl(Function<String, String> getenv) {
        String databaseUrl = firstNonBlank(env(getenv, "DATABASE_URL"), env(getenv, "INTERNAL_DATABASE_URL"));
        if (databaseUrl == null || !isPostgresUrl(databaseUrl)) {
            return null;
        }
        return parsePostgresUrl(databaseUrl);
    }

    private static JdbcSettings fromDiscreteVariables(Function<String, String> getenv) {
        String host = firstNonBlank(env(getenv, "DATABASE_HOST"), env(getenv, "PGHOST"));
        String user = firstNonBlank(env(getenv, "DATABASE_USER"), env(getenv, "PGUSER"));
        String password = firstNonBlank(env(getenv, "DATABASE_PASSWORD"), env(getenv, "PGPASSWORD"));
        String database = firstNonBlank(env(getenv, "DATABASE_NAME"), env(getenv, "PGDATABASE"));

        if (host == null || user == null || password == null || database == null) {
            return null;
        }

        String port = firstNonBlank(env(getenv, "DATABASE_PORT"), env(getenv, "PGPORT"));
        int portNumber = port != null ? Integer.parseInt(port) : 5432;
        String jdbcUrl = "jdbc:postgresql://" + host + ":" + portNumber + "/" + database;
        return new JdbcSettings(jdbcUrl, user, password);
    }

    private static JdbcSettings parsePostgresUrl(String databaseUrl) {
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
            String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + database;
            return new JdbcSettings(jdbcUrl, username, password);
        } catch (Exception ex) {
            throw new IllegalStateException("Não foi possível interpretar DATABASE_URL: " + maskUrl(databaseUrl), ex);
        }
    }

    public static boolean isProdRuntime() {
        String profiles = firstNonBlank(
                System.getenv("SPRING_PROFILES_ACTIVE"),
                System.getProperty("spring.profiles.active")
        );
        return profiles != null && profiles.contains("prod");
    }

    private static String env(Function<String, String> getenv, String key) {
        String value = getenv.apply(key);
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

    private static String maskUrl(String url) {
        if (url == null || url.length() < 12) {
            return "(url)";
        }
        return url.substring(0, 12) + "...";
    }
}

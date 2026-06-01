package com.vinicius.backend.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Define spring.datasource.* cedo no boot (complementa {@link ProdDataSourceConfiguration}).
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Optional<CloudDatabaseConfig.JdbcSettings> settings = CloudDatabaseConfig.resolve();
        if (settings.isPresent()) {
            Map<String, Object> props = new HashMap<>();
            CloudDatabaseConfig.JdbcSettings jdbc = settings.get();
            props.put("spring.datasource.url", jdbc.url());
            if (jdbc.username() != null && !jdbc.username().isBlank()) {
                props.put("spring.datasource.username", jdbc.username());
            }
            if (jdbc.password() != null) {
                props.put("spring.datasource.password", jdbc.password());
            }
            environment.getPropertySources().addFirst(new MapPropertySource("cloudDatabase", props));
            return;
        }

        if (CloudDatabaseConfig.isProdRuntime()) {
            throw new IllegalStateException(CloudDatabaseConfig.HELP);
        }
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}

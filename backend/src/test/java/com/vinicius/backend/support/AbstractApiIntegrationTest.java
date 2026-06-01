package com.vinicius.backend.support;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public abstract class AbstractApiIntegrationTest {

    protected static final String ADMIN_EMAIL = "admin@test.local";
    protected static final String ADMIN_PASSWORD = "test-password-123";

    private static final Pattern JSON_STRING_FIELD =
            Pattern.compile("\"(\\w+)\"\\s*:\\s*\"([^\"]*)\"");
    private static final Pattern JSON_NUMBER_FIELD =
            Pattern.compile("\"(\\w+)\"\\s*:\\s*(\\d+)");

    @Autowired
    protected MockMvc mockMvc;

    protected String obtainAccessToken() throws Exception {
        String body = """
                {"email":"%s","password":"%s"}
                """.formatted(ADMIN_EMAIL, ADMIN_PASSWORD);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();

        return readJsonField(result.getResponse().getContentAsString(), "token");
    }

    protected static String readJsonField(String json, String field) {
        Matcher stringMatcher = JSON_STRING_FIELD.matcher(json);
        while (stringMatcher.find()) {
            if (field.equals(stringMatcher.group(1))) {
                return stringMatcher.group(2);
            }
        }
        Matcher numberMatcher = JSON_NUMBER_FIELD.matcher(json);
        while (numberMatcher.find()) {
            if (field.equals(numberMatcher.group(1))) {
                return numberMatcher.group(2);
            }
        }
        throw new IllegalArgumentException("Campo JSON não encontrado: " + field);
    }

    protected static long readJsonLong(String json, String field) {
        return Long.parseLong(readJsonField(json, field));
    }

    protected RequestPostProcessor bearer(String token) {
        return request -> {
            request.addHeader("Authorization", "Bearer " + token);
            return request;
        };
    }
}

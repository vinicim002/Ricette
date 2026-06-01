package com.vinicius.backend.recipe;

import com.vinicius.backend.support.AbstractApiIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class RecipeIntegrationTest extends AbstractApiIntegrationTest {

    private String token;

    @BeforeEach
    void setUp() throws Exception {
        token = obtainAccessToken();
    }

    @Test
    void createReadUpdateDeleteRecipe() throws Exception {
        String createBody = """
                {
                  "title": "Bolo de cenoura",
                  "description": "Receita de teste",
                  "ingredients": "cenoura\\nfarinha",
                  "preparationSteps": "misturar\\nassar",
                  "videoUrl": "https://example.com/video",
                  "thumbnailUrl": "https://example.com/thumb.jpg"
                }
                """;

        MvcResult created = mockMvc.perform(post("/api/recipes")
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Bolo de cenoura"))
                .andReturn();

        long id = readJsonLong(created.getResponse().getContentAsString(), "id");

        mockMvc.perform(get("/api/recipes/" + id).with(bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ingredients").value("cenoura\nfarinha"));

        mockMvc.perform(put("/api/recipes/" + id)
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Bolo atualizado",
                                  "description": "",
                                  "ingredients": "cenoura",
                                  "preparationSteps": "assar",
                                  "videoUrl": "",
                                  "thumbnailUrl": ""
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Bolo atualizado"));

        mockMvc.perform(delete("/api/recipes/" + id).with(bearer(token)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/recipes/" + id).with(bearer(token)))
                .andExpect(status().isNotFound());
    }

    @Test
    void createRecipeWithEmptyTitleReturns400() throws Exception {
        mockMvc.perform(post("/api/recipes")
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "   ",
                                  "ingredients": "a",
                                  "preparationSteps": "b"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createRecipeWithInvalidVideoUrlReturns400() throws Exception {
        mockMvc.perform(post("/api/recipes")
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Teste",
                                  "ingredients": "a",
                                  "preparationSteps": "b",
                                  "videoUrl": "http://"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listRecipesByNonExistentCategoryReturns404() throws Exception {
        mockMvc.perform(get("/api/recipes?categoryId=999999").with(bearer(token)))
                .andExpect(status().isNotFound());
    }

    @Test
    void listRecipesReturnsPaginatedResult() throws Exception {
        mockMvc.perform(get("/api/recipes?page=0&size=10").with(bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void pageSizeAboveMaxIsCappedAt100() throws Exception {
        mockMvc.perform(post("/api/recipes")
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"R1","ingredients":"a","preparationSteps":"b"}
                                """))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/recipes?page=0&size=500").with(bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size").value(100));
    }
}

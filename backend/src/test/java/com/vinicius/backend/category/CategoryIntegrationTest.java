package com.vinicius.backend.category;

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

class CategoryIntegrationTest extends AbstractApiIntegrationTest {

    private String token;

    @BeforeEach
    void setUp() throws Exception {
        token = obtainAccessToken();
    }

    @Test
    void createCategoryAndFetchByIdWithSubtreeRecipeCount() throws Exception {
        MvcResult parentResult = mockMvc.perform(post("/api/categories")
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Doces","description":"Pasta doces"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.recipeCount").value(0))
                .andReturn();

        long parentId = readJsonLong(parentResult.getResponse().getContentAsString(), "id");

        mockMvc.perform(post("/api/categories")
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Bolos","parentId":%d}
                                """.formatted(parentId)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/recipes")
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Bolo simples",
                                  "ingredients": "farinha",
                                  "preparationSteps": "assar",
                                  "categoryId": %d
                                }
                                """.formatted(parentId)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/categories/" + parentId).with(bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recipeCount").value(1));

        mockMvc.perform(get("/api/categories/tree").with(bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].recipeCount").value(1));
    }

    @Test
    void moveCategoryIntoDescendantReturns400() throws Exception {
        MvcResult root = createCategory("Raiz", null);
        long rootId = idOf(root);

        MvcResult child = createCategory("Filha", rootId);
        long childId = idOf(child);

        mockMvc.perform(put("/api/categories/" + rootId + "/move")
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"parentId\":" + childId + "}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void reorderWithPartialSiblingListReturns400() throws Exception {
        MvcResult a = createCategory("A", null);
        createCategory("B", null);
        long aId = idOf(a);

        mockMvc.perform(put("/api/categories/reorder")
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"parentId\":null,\"orderedIds\":[" + aId + "]}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void reorderWithFullSiblingListSucceeds() throws Exception {
        MvcResult a = createCategory("Cat A", null);
        MvcResult b = createCategory("Cat B", null);
        long aId = idOf(a);
        long bId = idOf(b);

        mockMvc.perform(put("/api/categories/reorder")
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"parentId\":null,\"orderedIds\":[" + bId + "," + aId + "]}"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/categories/tree").with(bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Cat B"))
                .andExpect(jsonPath("$[1].name").value("Cat A"));
    }

    @Test
    void deleteCategoryWithChildReturns400() throws Exception {
        MvcResult parent = createCategory("Pai", null);
        long parentId = idOf(parent);
        createCategory("Filho", parentId);

        mockMvc.perform(delete("/api/categories/" + parentId).with(bearer(token)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteCategoryWithDirectRecipeReturns400() throws Exception {
        MvcResult cat = createCategory("Com receita", null);
        long catId = idOf(cat);

        mockMvc.perform(post("/api/recipes")
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Receita ligada",
                                  "ingredients": "x",
                                  "preparationSteps": "y",
                                  "categoryId": %d
                                }
                                """.formatted(catId)))
                .andExpect(status().isCreated());

        mockMvc.perform(delete("/api/categories/" + catId).with(bearer(token)))
                .andExpect(status().isBadRequest());
    }

    private MvcResult createCategory(String name, Long parentId) throws Exception {
        String parentJson = parentId == null ? "null" : parentId.toString();
        return mockMvc.perform(post("/api/categories")
                        .with(bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"%s","parentId":%s}
                                """.formatted(name, parentJson)))
                .andExpect(status().isCreated())
                .andReturn();
    }

    private long idOf(MvcResult result) throws Exception {
        return readJsonLong(result.getResponse().getContentAsString(), "id");
    }
}

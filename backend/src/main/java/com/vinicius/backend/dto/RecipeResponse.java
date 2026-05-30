package com.vinicius.backend.dto;

import com.vinicius.backend.entity.Recipe;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class RecipeResponse {

    private Long id;
    private String title;
    private String description;
    private String ingredients;
    private String preparationSteps;
    private String videoUrl;
    private String thumbnailUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static RecipeResponse fromEntity(Recipe recipe) {
        return RecipeMapper.toResponse(recipe);
    }
}

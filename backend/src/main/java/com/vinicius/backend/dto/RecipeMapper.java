package com.vinicius.backend.dto;

import com.vinicius.backend.entity.Recipe;

import java.util.Arrays;
import java.util.stream.Collectors;

public final class RecipeMapper {

    private RecipeMapper() {
    }

    public static RecipeRequest normalize(RecipeRequest request) {
        RecipeRequest normalized = new RecipeRequest();
        normalized.setTitle(trimToNull(request.getTitle()));
        normalized.setDescription(trimToEmpty(request.getDescription()));
        normalized.setIngredients(normalizeMultiline(request.getIngredients()));
        normalized.setPreparationSteps(normalizeMultiline(request.getPreparationSteps()));
        normalized.setVideoUrl(trimToEmpty(request.getVideoUrl()));
        normalized.setThumbnailUrl(trimToEmpty(request.getThumbnailUrl()));
        return normalized;
    }

    public static RecipeResponse toResponse(Recipe recipe) {
        return RecipeResponse.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .description(emptyIfNull(recipe.getDescription()))
                .ingredients(emptyIfNull(recipe.getIngredients()))
                .preparationSteps(emptyIfNull(recipe.getPreparationSteps()))
                .videoUrl(emptyIfNull(recipe.getVideoUrl()))
                .thumbnailUrl(emptyIfNull(recipe.getThumbnailUrl()))
                .createdAt(recipe.getCreatedAt())
                .updatedAt(recipe.getUpdatedAt())
                .build();
    }

    public static Recipe toEntity(RecipeRequest request) {
        return Recipe.builder()
                .title(request.getTitle())
                .description(emptyToNull(request.getDescription()))
                .ingredients(request.getIngredients())
                .preparationSteps(request.getPreparationSteps())
                .videoUrl(emptyToNull(request.getVideoUrl()))
                .thumbnailUrl(emptyToNull(request.getThumbnailUrl()))
                .build();
    }

    public static void applyToEntity(Recipe recipe, RecipeRequest request) {
        recipe.setTitle(request.getTitle());
        recipe.setDescription(emptyToNull(request.getDescription()));
        recipe.setIngredients(request.getIngredients());
        recipe.setPreparationSteps(request.getPreparationSteps());
        recipe.setVideoUrl(emptyToNull(request.getVideoUrl()));
        recipe.setThumbnailUrl(emptyToNull(request.getThumbnailUrl()));
    }

    private static String normalizeMultiline(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        return Arrays.stream(value.split("\n"))
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .collect(Collectors.joining("\n"));
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    private static String emptyIfNull(String value) {
        return value == null ? "" : value;
    }

    private static String emptyToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}

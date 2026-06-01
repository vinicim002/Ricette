package com.vinicius.backend.dto;

import com.vinicius.backend.validation.HttpUrl;
import com.vinicius.backend.validation.MultilineNotBlank;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeRequest {

    @NotBlank(message = "Título é obrigatório.")
    @Size(max = 255, message = "Título deve ter no máximo 255 caracteres.")
    private String title;

    @Size(max = 10000, message = "Descrição deve ter no máximo 10000 caracteres.")
    private String description;

    @MultilineNotBlank(message = "Adicione pelo menos um ingrediente.")
    @Size(max = 50000, message = "Ingredientes devem ter no máximo 50000 caracteres.")
    private String ingredients;

    @MultilineNotBlank(message = "Adicione pelo menos um passo do preparo.")
    @Size(max = 50000, message = "Modo de preparo deve ter no máximo 50000 caracteres.")
    private String preparationSteps;

    @HttpUrl(message = "Informe uma URL de vídeo válida (http ou https).")
    @Size(max = 500, message = "URL do vídeo deve ter no máximo 500 caracteres.")
    private String videoUrl;

    @HttpUrl(message = "Informe uma URL de thumbnail válida.")
    @Size(max = 500, message = "URL da thumbnail deve ter no máximo 500 caracteres.")
    private String thumbnailUrl;

    private Long categoryId;
}

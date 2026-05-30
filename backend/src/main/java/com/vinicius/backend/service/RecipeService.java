package com.vinicius.backend.service;

import com.vinicius.backend.dto.RecipeMapper;
import com.vinicius.backend.dto.RecipeRequest;
import com.vinicius.backend.dto.RecipeResponse;
import com.vinicius.backend.entity.Recipe;
import com.vinicius.backend.exception.ResourceNotFoundException;
import com.vinicius.backend.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;

    @Transactional(readOnly = true)
    public Page<RecipeResponse> findAll(Pageable pageable) {
        return recipeRepository.findAll(pageable).map(RecipeMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public RecipeResponse findById(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receita não encontrada."));
        return RecipeMapper.toResponse(recipe);
    }

    @Transactional
    public RecipeResponse create(RecipeRequest request) {
        RecipeRequest normalized = RecipeMapper.normalize(request);
        Recipe saved = recipeRepository.save(RecipeMapper.toEntity(normalized));
        return RecipeMapper.toResponse(saved);
    }

    @Transactional
    public RecipeResponse update(Long id, RecipeRequest request) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receita não encontrada."));

        RecipeRequest normalized = RecipeMapper.normalize(request);
        RecipeMapper.applyToEntity(recipe, normalized);

        Recipe updated = recipeRepository.save(recipe);
        return RecipeMapper.toResponse(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!recipeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Receita não encontrada.");
        }
        recipeRepository.deleteById(id);
    }
}

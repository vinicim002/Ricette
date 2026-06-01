package com.vinicius.backend.service;

import com.vinicius.backend.dto.RecipeMapper;
import com.vinicius.backend.dto.RecipeRequest;
import com.vinicius.backend.dto.RecipeResponse;
import com.vinicius.backend.entity.Category;
import com.vinicius.backend.entity.Recipe;
import com.vinicius.backend.exception.ResourceNotFoundException;
import org.springframework.data.domain.PageRequest;
import com.vinicius.backend.repository.CategoryRepository;
import com.vinicius.backend.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecipeService {

    public static final int MAX_PAGE_SIZE = 100;

    private final RecipeRepository recipeRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<RecipeResponse> findAll(Long categoryId, Pageable pageable) {
        Pageable safePageable = capPageSize(pageable);
        if (categoryId != null && !categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Categoria não encontrada.");
        }
        Page<Recipe> page = categoryId == null
                ? recipeRepository.findAll(safePageable)
                : recipeRepository.findByCategoryId(categoryId, safePageable);
        return page.map(RecipeMapper::toResponse);
    }

    private static Pageable capPageSize(Pageable pageable) {
        if (pageable.getPageSize() <= MAX_PAGE_SIZE) {
            return pageable;
        }
        return PageRequest.of(pageable.getPageNumber(), MAX_PAGE_SIZE, pageable.getSort());
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
        Category category = resolveCategory(normalized.getCategoryId());
        Recipe saved = recipeRepository.save(RecipeMapper.toEntity(normalized, category));
        return RecipeMapper.toResponse(saved);
    }

    @Transactional
    public RecipeResponse update(Long id, RecipeRequest request) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receita não encontrada."));

        RecipeRequest normalized = RecipeMapper.normalize(request);
        Category category = resolveCategory(normalized.getCategoryId());
        RecipeMapper.applyToEntity(recipe, normalized, category);

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

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));
    }
}

package com.vinicius.backend.repository;

import com.vinicius.backend.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    long countByCategoryId(Long categoryId);

    org.springframework.data.domain.Page<Recipe> findByCategoryId(Long categoryId, org.springframework.data.domain.Pageable pageable);
}

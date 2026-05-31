package com.vinicius.backend.dto;

import com.vinicius.backend.entity.CategoryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class CategoryResponse {

    private Long id;
    private String name;
    private String description;
    private String slug;
    private String pathSlug;
    private Long parentId;
    private Integer sortOrder;
    private CategoryStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long recipeCount;
    private List<CategoryResponse> children;
}

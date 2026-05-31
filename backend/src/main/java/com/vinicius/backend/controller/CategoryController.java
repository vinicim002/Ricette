package com.vinicius.backend.controller;

import com.vinicius.backend.dto.BreadcrumbItemDto;
import com.vinicius.backend.dto.CategoryMoveRequest;
import com.vinicius.backend.dto.CategoryReorderRequest;
import com.vinicius.backend.dto.CategoryRequest;
import com.vinicius.backend.dto.CategoryResponse;
import com.vinicius.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/tree")
    public ResponseEntity<List<CategoryResponse>> getTree() {
        return ResponseEntity.ok(categoryService.getTree());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getById(id));
    }

    @GetMapping("/path/{*pathSlug}")
    public ResponseEntity<CategoryResponse> getByPath(@PathVariable String pathSlug) {
        String normalized = pathSlug.startsWith("/") ? pathSlug.substring(1) : pathSlug;
        return ResponseEntity.ok(categoryService.getByPathSlug(normalized));
    }

    @GetMapping("/{id}/breadcrumb")
    public ResponseEntity<List<BreadcrumbItemDto>> getBreadcrumb(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getBreadcrumb(id));
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse created = categoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    @PutMapping("/{id}/move")
    public ResponseEntity<CategoryResponse> move(
            @PathVariable Long id,
            @RequestBody CategoryMoveRequest request) {
        return ResponseEntity.ok(categoryService.move(id, request));
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@Valid @RequestBody CategoryReorderRequest request) {
        categoryService.reorder(request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

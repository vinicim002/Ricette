package com.vinicius.backend.service;

import com.vinicius.backend.dto.BreadcrumbItemDto;
import com.vinicius.backend.dto.CategoryMoveRequest;
import com.vinicius.backend.dto.CategoryReorderRequest;
import com.vinicius.backend.dto.CategoryRequest;
import com.vinicius.backend.dto.CategoryResponse;
import com.vinicius.backend.entity.Category;
import com.vinicius.backend.entity.CategoryStatus;
import com.vinicius.backend.exception.BadRequestException;
import com.vinicius.backend.exception.ResourceNotFoundException;
import com.vinicius.backend.repository.CategoryRepository;
import com.vinicius.backend.repository.RecipeRepository;
import com.vinicius.backend.util.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final RecipeRepository recipeRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getTree() {
        List<Category> all = categoryRepository.findAll();
        Map<Long, Long> recipeCounts = buildRecipeCountMap();
        return buildTree(all, null, recipeCounts);
    }

    @Transactional(readOnly = true)
    public CategoryResponse getById(Long id) {
        Category category = findCategory(id);
        return toResponse(category, false, Map.of(category.getId(), recipeRepository.countByCategoryId(id)));
    }

    @Transactional(readOnly = true)
    public CategoryResponse getByPathSlug(String pathSlug) {
        Category category = categoryRepository.findByPathSlug(pathSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));
        return toResponse(category, false, Map.of(category.getId(), recipeRepository.countByCategoryId(category.getId())));
    }

    @Transactional(readOnly = true)
    public List<BreadcrumbItemDto> getBreadcrumb(Long id) {
        Category category = findCategory(id);
        List<BreadcrumbItemDto> items = new ArrayList<>();
        Category current = category;
        while (current != null) {
            items.add(0, new BreadcrumbItemDto(current.getId(), current.getName(), current.getPathSlug()));
            current = current.getParent();
        }
        return items;
    }

    @Transactional(readOnly = true)
    public List<BreadcrumbItemDto> getBreadcrumbByPath(String pathSlug) {
        return getBreadcrumb(getByPathSlug(pathSlug).getId());
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        Category parent = resolveParent(request.getParentId());
        String segmentSlug = resolveUniqueSegmentSlug(request.getName(), parent, null);
        int sortOrder = nextSortOrder(parent);

        Category category = Category.builder()
                .name(request.getName().trim())
                .description(trimDescription(request.getDescription()))
                .slug(segmentSlug)
                .pathSlug(buildPathSlug(parent, segmentSlug))
                .parent(parent)
                .sortOrder(sortOrder)
                .status(request.getStatus() != null ? request.getStatus() : CategoryStatus.ACTIVE)
                .build();

        Category saved = categoryRepository.save(category);
        return toResponse(saved, false, Map.of(saved.getId(), 0L));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findCategory(id);
        Category newParent = resolveParent(request.getParentId());

        if (newParent != null && isDescendant(newParent, category)) {
            throw new BadRequestException("Não é possível mover uma categoria para dentro de si mesma.");
        }

        String segmentSlug = resolveUniqueSegmentSlug(request.getName(), newParent, category.getId());
        category.setName(request.getName().trim());
        category.setDescription(trimDescription(request.getDescription()));
        category.setSlug(segmentSlug);
        category.setParent(newParent);
        if (request.getStatus() != null) {
            category.setStatus(request.getStatus());
        }

        category.setPathSlug(buildPathSlug(newParent, segmentSlug));
        Category saved = categoryRepository.save(category);
        refreshDescendantPaths(saved);

        return toResponse(saved, false, Map.of(saved.getId(), recipeRepository.countByCategoryId(saved.getId())));
    }

    @Transactional
    public CategoryResponse move(Long id, CategoryMoveRequest request) {
        CategoryRequest updateRequest = new CategoryRequest();
        Category existing = findCategory(id);
        updateRequest.setName(existing.getName());
        updateRequest.setDescription(existing.getDescription());
        updateRequest.setParentId(request.getParentId());
        updateRequest.setStatus(existing.getStatus());
        return update(id, updateRequest);
    }

    @Transactional
    public void reorder(CategoryReorderRequest request) {
        List<Category> siblings = request.getParentId() == null
                ? categoryRepository.findAllByParentIsNullOrderBySortOrderAscNameAsc()
                : categoryRepository.findAllByParentIdOrderBySortOrderAscNameAsc(request.getParentId());

        Set<Long> siblingIds = new HashSet<>();
        for (Category sibling : siblings) {
            siblingIds.add(sibling.getId());
        }

        int order = 0;
        for (Long id : request.getOrderedIds()) {
            if (!siblingIds.contains(id)) {
                throw new BadRequestException("Categoria não pertence ao mesmo nível.");
            }
            Category category = findCategory(id);
            category.setSortOrder(order++);
            categoryRepository.save(category);
        }
    }

    @Transactional
    public void delete(Long id) {
        Category category = findCategory(id);
        if (categoryRepository.countByParentId(id) > 0) {
            throw new BadRequestException("Exclua ou mova as subcategorias antes de excluir esta categoria.");
        }
        if (recipeRepository.countByCategoryId(id) > 0) {
            throw new BadRequestException("Existem receitas nesta categoria. Mova-as antes de excluir.");
        }
        categoryRepository.delete(category);
    }

    private Category findCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));
    }

    private Category resolveParent(Long parentId) {
        if (parentId == null) {
            return null;
        }
        return findCategory(parentId);
    }

    private int nextSortOrder(Category parent) {
        List<Category> siblings = parent == null
                ? categoryRepository.findAllByParentIsNullOrderBySortOrderAscNameAsc()
                : categoryRepository.findAllByParentIdOrderBySortOrderAscNameAsc(parent.getId());
        return siblings.size();
    }

    private String resolveUniqueSegmentSlug(String name, Category parent, Long excludeId) {
        String base = SlugUtils.toSlug(name);
        String candidate = base;
        int attempt = 0;

        while (slugExistsAmongSiblings(parent, candidate, excludeId)) {
            attempt++;
            candidate = SlugUtils.uniqueSlug(base, attempt);
        }
        return candidate;
    }

    private boolean slugExistsAmongSiblings(Category parent, String slug, Long excludeId) {
        if (excludeId == null) {
            if (parent == null) {
                return categoryRepository.existsByParentIsNullAndSlug(slug);
            }
            return categoryRepository.existsByParentIdAndSlug(parent.getId(), slug);
        }
        if (parent == null) {
            return categoryRepository.existsRootSiblingSlug(slug, excludeId);
        }
        return categoryRepository.existsSiblingSlug(parent.getId(), slug, excludeId);
    }

    private String buildPathSlug(Category parent, String segmentSlug) {
        if (parent == null) {
            return segmentSlug;
        }
        return parent.getPathSlug() + "/" + segmentSlug;
    }

    private void refreshDescendantPaths(Category root) {
        List<Category> all = categoryRepository.findAll();
        Map<Long, List<Category>> byParent = new HashMap<>();
        for (Category category : all) {
            Long parentKey = category.getParent() != null ? category.getParent().getId() : null;
            byParent.computeIfAbsent(parentKey, key -> new ArrayList<>()).add(category);
        }
        updateDescendantPaths(root, byParent);
    }

    private void updateDescendantPaths(Category parent, Map<Long, List<Category>> byParent) {
        List<Category> children = byParent.get(parent.getId());
        if (children == null) {
            return;
        }
        for (Category child : children) {
            child.setPathSlug(buildPathSlug(parent, child.getSlug()));
            categoryRepository.save(child);
            updateDescendantPaths(child, byParent);
        }
    }

    private boolean isDescendant(Category candidate, Category ancestor) {
        Category current = candidate;
        while (current != null) {
            if (current.getId().equals(ancestor.getId())) {
                return true;
            }
            current = current.getParent();
        }
        return false;
    }

    private String trimDescription(String description) {
        if (description == null) {
            return null;
        }
        String trimmed = description.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private Map<Long, Long> buildRecipeCountMap() {
        Map<Long, Long> counts = new HashMap<>();
        for (Category category : categoryRepository.findAll()) {
            counts.put(category.getId(), recipeRepository.countByCategoryId(category.getId()));
        }
        return counts;
    }

    private List<CategoryResponse> buildTree(List<Category> all, Long parentId, Map<Long, Long> recipeCounts) {
        List<CategoryResponse> result = new ArrayList<>();
        for (Category category : all) {
            Long currentParentId = category.getParent() != null ? category.getParent().getId() : null;
            if ((parentId == null && currentParentId == null) || (parentId != null && parentId.equals(currentParentId))) {
                result.add(toResponse(category, true, recipeCounts));
            }
        }
        result.sort((a, b) -> {
            int orderCompare = Integer.compare(
                    a.getSortOrder() != null ? a.getSortOrder() : 0,
                    b.getSortOrder() != null ? b.getSortOrder() : 0
            );
            if (orderCompare != 0) {
                return orderCompare;
            }
            return a.getName().compareToIgnoreCase(b.getName());
        });
        for (int i = 0; i < result.size(); i++) {
            CategoryResponse node = result.get(i);
            List<CategoryResponse> children = buildTree(all, node.getId(), recipeCounts);
            long directCount = recipeCounts.getOrDefault(node.getId(), 0L);
            long totalCount = directCount;
            for (CategoryResponse child : children) {
                totalCount += child.getRecipeCount();
            }
            result.set(i, CategoryResponse.builder()
                    .id(node.getId())
                    .name(node.getName())
                    .description(node.getDescription())
                    .slug(node.getSlug())
                    .pathSlug(node.getPathSlug())
                    .parentId(node.getParentId())
                    .sortOrder(node.getSortOrder())
                    .status(node.getStatus())
                    .createdAt(node.getCreatedAt())
                    .updatedAt(node.getUpdatedAt())
                    .recipeCount(totalCount)
                    .children(children)
                    .build());
        }
        return result;
    }

    private CategoryResponse toResponse(Category category, boolean withChildren, Map<Long, Long> recipeCounts) {
        long count = recipeCounts.getOrDefault(category.getId(), 0L);
        List<CategoryResponse> children = withChildren ? List.of() : null;

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription() != null ? category.getDescription() : "")
                .slug(category.getSlug())
                .pathSlug(category.getPathSlug())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .sortOrder(category.getSortOrder())
                .status(category.getStatus())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .recipeCount(count)
                .children(children)
                .build();
    }
}

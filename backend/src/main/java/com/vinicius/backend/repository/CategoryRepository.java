package com.vinicius.backend.repository;

import com.vinicius.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByPathSlug(String pathSlug);

    List<Category> findAllByParentIsNullOrderBySortOrderAscNameAsc();

    List<Category> findAllByParentIdOrderBySortOrderAscNameAsc(Long parentId);

    boolean existsByParentIdAndSlug(Long parentId, String slug);

    boolean existsByParentIsNullAndSlug(String slug);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Category c WHERE c.parent.id = :parentId AND c.slug = :slug AND c.id <> :excludeId")
    boolean existsSiblingSlug(Long parentId, String slug, Long excludeId);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Category c WHERE c.parent IS NULL AND c.slug = :slug AND c.id <> :excludeId")
    boolean existsRootSiblingSlug(String slug, Long excludeId);

    long countByParentId(Long parentId);
}

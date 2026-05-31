package com.vinicius.backend.util;

import java.text.Normalizer;
import java.util.Locale;

public final class SlugUtils {

    private SlugUtils() {
    }

    public static String toSlug(String value) {
        if (value == null || value.isBlank()) {
            return "categoria";
        }

        String normalized = Normalizer.normalize(value.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT);

        String slug = normalized
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s_-]+", "-")
                .replaceAll("^-+|-+$", "");

        return slug.isEmpty() ? "categoria" : slug;
    }

    public static String uniqueSlug(String baseSlug, int attempt) {
        if (attempt <= 0) {
            return baseSlug;
        }
        return baseSlug + "-" + attempt;
    }
}

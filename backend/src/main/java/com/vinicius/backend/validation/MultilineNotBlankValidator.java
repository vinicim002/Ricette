package com.vinicius.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;

public class MultilineNotBlankValidator implements ConstraintValidator<MultilineNotBlank, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return false;
        }

        return Arrays.stream(value.split("\n"))
                .map(String::trim)
                .anyMatch(line -> !line.isEmpty());
    }
}

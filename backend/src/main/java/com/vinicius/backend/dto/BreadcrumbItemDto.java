package com.vinicius.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BreadcrumbItemDto {

    private Long id;
    private String name;
    private String pathSlug;
}

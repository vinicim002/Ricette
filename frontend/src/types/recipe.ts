export interface Recipe {
  id: number
  title: string
  description: string
  ingredients: string[]
  steps: string[]
  videoUrl: string
  thumbnailUrl: string
  categoryId?: number | null
  categoryName?: string | null
  categoryPathSlug?: string | null
  createdAt: string
}

export interface RecipeSummary {
  id: number
  title: string
  thumbnailUrl: string
  createdAt: string
  categoryId?: number | null
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface LoginResponse {
  token: string
}

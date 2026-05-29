export interface Recipe {
  id: number
  title: string
  description: string
  ingredients: string[]
  steps: string[]
  videoUrl: string
  thumbnailUrl: string
  createdAt: string
}

export interface RecipeSummary {
  id: number
  title: string
  thumbnailUrl: string
  createdAt: string
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

import type { PaginatedResponse, Recipe, RecipeSummary } from '../types/recipe'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
const TOKEN_KEY = 'ricette_token'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | Record<string, unknown> | null
  auth?: boolean
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, body, headers: customHeaders, ...rest } = options

  const headers = new Headers(customHeaders)

  if (auth) {
    const token = getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  let resolvedBody: BodyInit | undefined

  if (body instanceof FormData || body instanceof URLSearchParams || typeof body === 'string') {
    resolvedBody = body
  } else if (body != null) {
    headers.set('Content-Type', 'application/json')
    resolvedBody = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    body: resolvedBody,
  })

  if (!response.ok) {
    let message = 'Erro inesperado. Tente novamente.'
    try {
      const data = (await response.json()) as { message?: string; error?: string }
      message = data.message ?? data.error ?? message
    } catch {
      message = response.statusText || message
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>
  }

  return undefined as T
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string }>('/auth/login', {
      method: 'POST',
      auth: false,
      body: { email, password },
    }),

  getRecipes: (params?: { page?: number; size?: number; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page != null) searchParams.set('page', String(params.page))
    if (params?.size != null) searchParams.set('size', String(params.size))
    if (params?.search) searchParams.set('search', params.search)

    const query = searchParams.toString()
    return request<PaginatedResponse<RecipeSummary>>(
      `/recipes${query ? `?${query}` : ''}`,
    )
  },

  getRecipe: (id: number) => request<RecipeApiDto>(`/recipes/${id}`),

  createRecipe: (body: RecipePayload) =>
    request<RecipeApiDto>('/recipes', { method: 'POST', body: { ...body } }),

  updateRecipe: (id: number, body: RecipePayload) =>
    request<RecipeApiDto>(`/recipes/${id}`, { method: 'PUT', body: { ...body } }),

  deleteRecipe: (id: number) =>
    request<void>(`/recipes/${id}`, { method: 'DELETE' }),
}

export interface RecipePayload {
  title: string
  description: string
  ingredients: string
  preparationSteps: string
  videoUrl: string
  thumbnailUrl: string
}

interface RecipeApiDto {
  id: number
  title: string
  description: string
  ingredients: string
  preparationSteps: string
  videoUrl: string
  thumbnailUrl: string
  createdAt: string
  updatedAt?: string
}

export function mapRecipeFromApi(dto: RecipeApiDto): Recipe {
  const split = (value: string) =>
    value
      ?.split('\n')
      .map((line) => line.trim())
      .filter(Boolean) ?? []

  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? '',
    ingredients: split(dto.ingredients),
    steps: split(dto.preparationSteps),
    videoUrl: dto.videoUrl ?? '',
    thumbnailUrl: dto.thumbnailUrl ?? '',
    createdAt: dto.createdAt,
  }
}

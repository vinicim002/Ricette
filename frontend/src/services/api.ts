import type {
  BreadcrumbItem,
  Category,
  CategoryMovePayload,
  CategoryPayload,
  CategoryReorderPayload,
} from '../types/category'
import type { PaginatedResponse, Recipe, RecipeSummary } from '../types/recipe'

const TOKEN_KEY = 'ricette_token'

/** Em dev use `/api` (proxy Vite). URL absoluta só se VITE_API_URL estiver definida. */
function resolveApiBase(): string {
  const configured = import.meta.env.VITE_API_URL?.trim()
  if (!configured) return '/api'
  const base = configured.replace(/\/$/, '')
  if (base.endsWith('/api')) return base
  return `${base}/api`
}

const API_BASE = resolveApiBase()

export const AUTH_LOGOUT_EVENT = 'ricette:auth-logout'

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

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers,
      body: resolvedBody,
    })
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080.',
      0,
    )
  }

  if (!response.ok) {
    let message = 'Erro inesperado. Tente novamente.'
    try {
      const data = (await response.json()) as { message?: string; error?: string }
      message = data.message ?? data.error ?? message
    } catch {
      message = response.statusText || message
    }

    if (response.status === 401 && auth) {
      clearToken()
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
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

  getRecipes: (params?: { page?: number; size?: number; categoryId?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.page != null) searchParams.set('page', String(params.page))
    if (params?.size != null) searchParams.set('size', String(params.size))
    if (params?.categoryId != null) searchParams.set('categoryId', String(params.categoryId))

    const query = searchParams.toString()
    return request<PaginatedResponse<RecipeApiDto>>(
      `/recipes${query ? `?${query}` : ''}`,
    )
  },

  getCategoryTree: () => request<Category[]>('/categories/tree'),

  getCategory: (id: number) => request<Category>(`/categories/${id}`),

  getCategoryByPath: (pathSlug: string) =>
    request<Category>(`/categories/path/${pathSlug}`),

  getCategoryBreadcrumb: (id: number) =>
    request<BreadcrumbItem[]>(`/categories/${id}/breadcrumb`),

  createCategory: (body: CategoryPayload) =>
    request<Category>('/categories', { method: 'POST', body: { ...body } }),

  updateCategory: (id: number, body: CategoryPayload) =>
    request<Category>(`/categories/${id}`, { method: 'PUT', body: { ...body } }),

  moveCategory: (id: number, body: CategoryMovePayload) =>
    request<Category>(`/categories/${id}/move`, { method: 'PUT', body: { ...body } }),

  reorderCategories: (body: CategoryReorderPayload) =>
    request<void>('/categories/reorder', { method: 'PUT', body: { ...body } }),

  deleteCategory: (id: number) =>
    request<void>(`/categories/${id}`, { method: 'DELETE' }),

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
  categoryId?: number | null
}

interface RecipeApiDto {
  id: number
  title: string
  description: string
  ingredients: string
  preparationSteps: string
  videoUrl: string
  thumbnailUrl: string
  categoryId?: number | null
  categoryName?: string | null
  categoryPathSlug?: string | null
  createdAt: string
  updatedAt?: string
}

export function mapRecipeSummaryFromApi(dto: RecipeApiDto): RecipeSummary {
  return {
    id: dto.id,
    title: dto.title,
    thumbnailUrl: dto.thumbnailUrl ?? '',
    createdAt: dto.createdAt,
    categoryId: dto.categoryId ?? null,
  }
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
    categoryId: dto.categoryId ?? null,
    categoryName: dto.categoryName ?? null,
    categoryPathSlug: dto.categoryPathSlug ?? null,
    createdAt: dto.createdAt,
  }
}

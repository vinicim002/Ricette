export type CategoryStatus = 'ACTIVE' | 'INACTIVE'

export interface Category {
  id: number
  name: string
  description: string
  slug: string
  pathSlug: string
  parentId: number | null
  sortOrder: number
  status: CategoryStatus
  createdAt: string
  updatedAt: string
  recipeCount: number
  children?: Category[]
}

export interface CategoryPayload {
  name: string
  description?: string
  parentId?: number | null
  status?: CategoryStatus
}

export interface CategoryMovePayload {
  parentId: number | null
}

export interface CategoryReorderPayload {
  parentId: number | null
  orderedIds: number[]
}

export interface BreadcrumbItem {
  id: number
  name: string
  pathSlug: string
}

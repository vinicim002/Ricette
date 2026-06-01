import { describe, expect, it } from 'vitest'
import type { Category } from '../types/category'
import {
  collectDescendantIds,
  flattenCategoriesForParentSelect,
  findCategoryInTree,
} from './categoryUtils'

const tree: Category[] = [
  {
    id: 1,
    name: 'Doces',
    description: '',
    slug: 'doces',
    pathSlug: 'doces',
    parentId: null,
    sortOrder: 0,
    status: 'ACTIVE',
    recipeCount: 0,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-01T00:00:00',
    children: [
      {
        id: 2,
        name: 'Bolos',
        description: '',
        slug: 'bolos',
        pathSlug: 'doces/bolos',
        parentId: 1,
        sortOrder: 0,
        status: 'ACTIVE',
        recipeCount: 0,
        createdAt: '2026-01-01T00:00:00',
        updatedAt: '2026-01-01T00:00:00',
        children: [],
      },
    ],
  },
]

describe('categoryUtils', () => {
  it('finds category in tree', () => {
    expect(findCategoryInTree(tree, 2)?.name).toBe('Bolos')
  })

  it('collects descendant ids', () => {
    const root = findCategoryInTree(tree, 1)!
    expect(collectDescendantIds(root)).toEqual(new Set([2]))
  })

  it('excludes self and descendants from parent select', () => {
    const options = flattenCategoriesForParentSelect(tree, 1)
    expect(options.map((o) => o.id)).not.toContain(1)
    expect(options.map((o) => o.id)).not.toContain(2)
  })
})

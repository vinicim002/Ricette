import type { Category } from '../types/category'

export function flattenCategories(
  nodes: Category[],
  depth = 0,
): Array<{ id: number; label: string; pathSlug: string }> {
  const result: Array<{ id: number; label: string; pathSlug: string }> = []
  for (const node of nodes) {
    const prefix = depth > 0 ? `${'— '.repeat(depth)}` : ''
    result.push({
      id: node.id,
      label: `${prefix}${node.name}`,
      pathSlug: node.pathSlug,
    })
    if (node.children?.length) {
      result.push(...flattenCategories(node.children, depth + 1))
    }
  }
  return result
}

export function findCategoryInTree(nodes: Category[], id: number): Category | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children?.length) {
      const found = findCategoryInTree(node.children, id)
      if (found) return found
    }
  }
  return null
}

/** IDs da categoria e de todos os descendentes (para impedir ciclo no select de pai). */
export function collectDescendantIds(category: Category): Set<number> {
  const ids = new Set<number>()
  function walk(nodes: Category[]) {
    for (const node of nodes) {
      ids.add(node.id)
      if (node.children?.length) walk(node.children)
    }
  }
  if (category.children?.length) walk(category.children)
  return ids
}

export function flattenCategoriesForParentSelect(
  nodes: Category[],
  excludeCategoryId: number | null,
): Array<{ id: number; label: string; pathSlug: string }> {
  const exclude = new Set<number>()
  if (excludeCategoryId != null) {
    exclude.add(excludeCategoryId)
    const node = findCategoryInTree(nodes, excludeCategoryId)
    if (node) {
      for (const id of collectDescendantIds(node)) {
        exclude.add(id)
      }
    }
  }
  return flattenCategories(nodes).filter((opt) => !exclude.has(opt.id))
}

export function findCategoryByPathSlug(nodes: Category[], pathSlug: string): Category | null {
  for (const node of nodes) {
    if (node.pathSlug === pathSlug) return node
    if (node.children?.length) {
      const found = findCategoryByPathSlug(node.children, pathSlug)
      if (found) return found
    }
  }
  return null
}

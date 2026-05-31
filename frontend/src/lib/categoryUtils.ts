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

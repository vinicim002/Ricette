import { useCallback, useEffect, useState } from 'react'
import { findCategoryByPathSlug } from '../lib/categoryUtils'
import { toastError } from '../lib/toast'
import { api } from '../services/api'
import type { BreadcrumbItem, Category } from '../types/category'

const USE_API = import.meta.env.VITE_USE_API === 'true'

export function useCategoryBrowse(pathSlug: string) {
  const [category, setCategory] = useState<Category | null>(null)
  const [children, setChildren] = useState<Category[]>([])
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!USE_API) {
      setError('Ative VITE_USE_API=true para navegar por categorias.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const tree = await api.getCategoryTree()

      if (!pathSlug) {
        setCategory(null)
        setChildren(tree)
        setBreadcrumb([])
        return
      }

      const node = findCategoryByPathSlug(tree, pathSlug)
      if (!node) {
        throw new Error('Categoria não encontrada.')
      }

      const [detail, crumbs] = await Promise.all([
        api.getCategoryByPath(pathSlug),
        api.getCategoryBreadcrumb(node.id),
      ])

      setCategory(detail)
      setChildren(node.children ?? [])
      setBreadcrumb(crumbs)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar categoria.'
      setError(message)
      setCategory(null)
      setChildren([])
      setBreadcrumb([])
      toastError(message)
    } finally {
      setLoading(false)
    }
  }, [pathSlug])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { category, children, breadcrumb, loading, error, refetch, isRoot: !pathSlug }
}

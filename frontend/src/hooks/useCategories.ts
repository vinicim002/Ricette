import { useCallback, useEffect, useState } from 'react'
import { toastError } from '../lib/toast'
import type { Category, CategoryPayload } from '../types/category'
import { api } from '../services/api'

const USE_API = import.meta.env.VITE_USE_API === 'true'

export function useCategoryTree() {
  const [tree, setTree] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!USE_API) {
      setTree([])
      setError('Ative VITE_USE_API=true para gerenciar categorias.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await api.getCategoryTree()
      setTree(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar categorias.'
      setError(message)
      toastError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const createCategory = useCallback(
    async (payload: CategoryPayload) => {
      const created = await api.createCategory(payload)
      await refetch()
      return created
    },
    [refetch],
  )

  const updateCategory = useCallback(
    async (id: number, payload: CategoryPayload) => {
      const updated = await api.updateCategory(id, payload)
      await refetch()
      return updated
    },
    [refetch],
  )

  const deleteCategory = useCallback(
    async (id: number) => {
      await api.deleteCategory(id)
      await refetch()
    },
    [refetch],
  )

  const moveCategory = useCallback(
    async (id: number, parentId: number | null) => {
      const moved = await api.moveCategory(id, { parentId })
      await refetch()
      return moved
    },
    [refetch],
  )

  return {
    tree,
    loading,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
    moveCategory,
  }
}

import { useCallback, useEffect, useState } from 'react'
import { toastError } from '../lib/toast'
import { getMockRecipe, getMockRecipes, mockDelay } from '../mocks/recipes'
import type { Recipe, RecipeSummary } from '../types/recipe'

interface UseRecipesResult {
  recipes: RecipeSummary[]
  loading: boolean
  error: string | null
  search: string
  setSearch: (value: string) => void
  refetch: () => void
  deleteRecipe: (id: number) => Promise<void>
}

export function useRecipes(): UseRecipesResult {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await mockDelay()
      setRecipes(getMockRecipes(search))
    } catch {
      const message = 'Erro ao carregar receitas.'
      setError(message)
      toastError(message)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timer = setTimeout(fetchRecipes, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [fetchRecipes, search])

  const deleteRecipe = useCallback(async (id: number) => {
    await mockDelay(200)
    setRecipes((prev) => prev.filter((r) => r.id !== id))
  }, [])

  return {
    recipes,
    loading,
    error,
    search,
    setSearch,
    refetch: fetchRecipes,
    deleteRecipe,
  }
}

interface UseRecipeResult {
  recipe: Recipe | null
  loading: boolean
  error: string | null
  refetch: () => void
}

function isValidRecipeId(id: number): boolean {
  return Number.isFinite(id) && id > 0
}

export function useRecipe(id: number): UseRecipeResult {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!isValidRecipeId(id)) {
      const message = 'Receita inválida.'
      setError(message)
      toastError(message)
      setRecipe(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    await mockDelay()
    const data = getMockRecipe(id)
    if (data) {
      setRecipe(data)
    } else {
      const message = 'Receita não encontrada.'
      setError(message)
      toastError(message)
      setRecipe(null)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    let cancelled = false

    async function loadRecipe() {
      if (!isValidRecipeId(id)) {
        const message = 'Receita inválida.'
        setError(message)
        toastError(message)
        setRecipe(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      await mockDelay()
      if (cancelled) return
      const data = getMockRecipe(id)
      if (data) {
        setRecipe(data)
      } else {
        const message = 'Receita não encontrada.'
        setError(message)
        toastError(message)
        setRecipe(null)
      }
      setLoading(false)
    }

    void loadRecipe()
    return () => {
      cancelled = true
    }
  }, [id])

  return { recipe, loading, error, refetch }
}

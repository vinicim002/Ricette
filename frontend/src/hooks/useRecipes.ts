import { useCallback, useEffect, useState } from 'react'
import { toastError } from '../lib/toast'
import { getShowcaseRecipe } from '../mocks/showcaseRecipes'
import { getMockRecipe, getMockRecipes, mockDelay } from '../mocks/recipes'
import { api, mapRecipeFromApi, mapRecipeSummaryFromApi } from '../services/api'
import type { Recipe, RecipeSummary } from '../types/recipe'

const USE_API = import.meta.env.VITE_USE_API === 'true'

interface UseRecipesResult {
  recipes: RecipeSummary[]
  loading: boolean
  error: string | null
  search: string
  setSearch: (value: string) => void
  refetch: () => void
  deleteRecipe: (id: number) => Promise<void>
}

function filterBySearch(recipes: RecipeSummary[], search: string): RecipeSummary[] {
  if (!search.trim()) return recipes
  const term = search.toLowerCase()
  return recipes.filter((recipe) => recipe.title.toLowerCase().includes(term))
}

interface UseRecipesOptions {
  categoryId?: number
}

export function useRecipes(options: UseRecipesOptions = {}): UseRecipesResult {
  const { categoryId } = options
  const [recipes, setRecipes] = useState<RecipeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (USE_API) {
        const response = await api.getRecipes({
          page: 0,
          size: 100,
          categoryId,
        })
        const summaries = response.content.map(mapRecipeSummaryFromApi)
        setRecipes(filterBySearch(summaries, search))
      } else {
        await mockDelay()
        setRecipes(getMockRecipes(search))
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar receitas.'
      setError(message)
      toastError(message)
    } finally {
      setLoading(false)
    }
  }, [search, categoryId])

  useEffect(() => {
    const timer = setTimeout(fetchRecipes, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [fetchRecipes, search])

  const deleteRecipe = useCallback(async (id: number) => {
    if (USE_API) {
      await api.deleteRecipe(id)
    } else {
      await mockDelay(200)
    }
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
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

interface UseRecipeOptions {
  /** Apenas receitas de exemplo da landing (rota pública). */
  showcaseOnly?: boolean
}

export function useRecipe(id: number, options: UseRecipeOptions = {}): UseRecipeResult {
  const { showcaseOnly = false } = options
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
    try {
      if (USE_API && !showcaseOnly) {
        const dto = await api.getRecipe(id)
        setRecipe(mapRecipeFromApi(dto))
      } else {
        await mockDelay()
        const data = showcaseOnly ? getShowcaseRecipe(id) : getMockRecipe(id)
        if (data) {
          setRecipe(data)
        } else {
          throw new Error(
            showcaseOnly ? 'Exemplo não encontrado.' : 'Receita não encontrada.',
          )
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Receita não encontrada.'
      setError(message)
      toastError(message)
      setRecipe(null)
    } finally {
      setLoading(false)
    }
  }, [id, showcaseOnly])

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
      try {
        if (USE_API && !showcaseOnly) {
          const dto = await api.getRecipe(id)
          if (!cancelled) setRecipe(mapRecipeFromApi(dto))
        } else {
          await mockDelay()
          if (cancelled) return
          const data = showcaseOnly ? getShowcaseRecipe(id) : getMockRecipe(id)
          if (data) {
            setRecipe(data)
          } else {
            throw new Error(
              showcaseOnly ? 'Exemplo não encontrado.' : 'Receita não encontrada.',
            )
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Receita não encontrada.'
        if (!cancelled) {
          setError(message)
          toastError(message)
          setRecipe(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadRecipe()
    return () => {
      cancelled = true
    }
  }, [id, showcaseOnly])

  return { recipe, loading, error, refetch }
}

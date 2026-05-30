import { useCallback, useEffect, useState } from 'react'
import {
  emptyRecipeForm,
  formValuesToPayload,
  recipeToFormValues,
  validateRecipeForm,
  type RecipeFormErrors,
  type RecipeFormValues,
} from '../lib/recipeForm'
import { toastError } from '../lib/toast'
import {
  createMockRecipe,
  getMockRecipe,
  mockDelay,
  updateMockRecipe,
} from '../mocks/recipes'
import { api, mapRecipeFromApi } from '../services/api'

const USE_API = import.meta.env.VITE_USE_API === 'true'

interface UseRecipeFormOptions {
  recipeId?: number
}

export function useRecipeForm({ recipeId }: UseRecipeFormOptions = {}) {
  const isEdit = recipeId != null && recipeId > 0
  const [values, setValues] = useState<RecipeFormValues>(emptyRecipeForm)
  const [errors, setErrors] = useState<RecipeFormErrors>({})
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEdit || recipeId == null) return

    let cancelled = false

    async function load() {
      const id = recipeId!
      setLoading(true)
      setLoadError(null)
      try {
        if (USE_API) {
          const dto = await api.getRecipe(id)
          if (!cancelled) setValues(recipeToFormValues(mapRecipeFromApi(dto)))
        } else {
          await mockDelay()
          const recipe = getMockRecipe(id)
          if (!recipe) {
            throw new Error('Receita não encontrada.')
          }
          if (!cancelled) setValues(recipeToFormValues(recipe))
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar receita.'
        if (!cancelled) {
          setLoadError(message)
          toastError(message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [isEdit, recipeId])

  const submit = useCallback(async (): Promise<number | null> => {
    const validation = validateRecipeForm(values)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      toastError('Revise os campos destacados.')
      return null
    }

    setSubmitting(true)
    const payload = formValuesToPayload(values)

    try {
      if (USE_API) {
        if (isEdit && recipeId != null) {
          const dto = await api.updateRecipe(recipeId, payload)
          return dto.id
        }
        const dto = await api.createRecipe(payload)
        return dto.id
      }

      await mockDelay(400)
      if (isEdit && recipeId != null) {
        const updated = updateMockRecipe(recipeId, payload)
        return updated.id
      }
      const created = createMockRecipe(payload)
      return created.id
    } finally {
      setSubmitting(false)
    }
  }, [isEdit, recipeId, values])

  return {
    values,
    setValues,
    errors,
    setErrors,
    loading,
    submitting,
    loadError,
    isEdit,
    submit,
  }
}

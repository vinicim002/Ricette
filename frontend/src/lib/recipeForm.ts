export interface RecipeFormValues {
  title: string
  description: string
  ingredients: string[]
  steps: string[]
  videoUrl: string
  thumbnailUrl: string
  categoryId: number | null
}

export type RecipeFormErrors = Partial<Record<keyof RecipeFormValues | 'ingredients' | 'steps', string>>

export const emptyRecipeForm = (categoryId: number | null = null): RecipeFormValues => ({
  title: '',
  description: '',
  ingredients: [''],
  steps: [''],
  videoUrl: '',
  thumbnailUrl: '',
  categoryId,
})

export function parseListField(value: string | null | undefined): string[] {
  if (!value?.trim()) return []
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function serializeListField(items: string[]): string {
  return items.map((item) => item.trim()).filter(Boolean).join('\n')
}

export function recipeToFormValues(recipe: {
  title: string
  description: string
  ingredients: string[]
  steps: string[]
  videoUrl: string
  thumbnailUrl: string
  categoryId?: number | null
}): RecipeFormValues {
  return {
    title: recipe.title,
    description: recipe.description ?? '',
    ingredients: recipe.ingredients.length > 0 ? [...recipe.ingredients] : [''],
    steps: recipe.steps.length > 0 ? [...recipe.steps] : [''],
    videoUrl: recipe.videoUrl ?? '',
    thumbnailUrl: recipe.thumbnailUrl ?? '',
    categoryId: recipe.categoryId ?? null,
  }
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateRecipeForm(values: RecipeFormValues): RecipeFormErrors {
  const errors: RecipeFormErrors = {}

  if (!values.title.trim()) {
    errors.title = 'Título é obrigatório.'
  } else if (values.title.trim().length > 255) {
    errors.title = 'Título deve ter no máximo 255 caracteres.'
  }

  if (values.videoUrl.trim() && !isValidUrl(values.videoUrl.trim())) {
    errors.videoUrl = 'Informe uma URL de vídeo válida (http ou https).'
  }

  if (values.thumbnailUrl.trim() && !isValidUrl(values.thumbnailUrl.trim())) {
    errors.thumbnailUrl = 'Informe uma URL de thumbnail válida.'
  }

  const filledIngredients = values.ingredients.filter((i) => i.trim())
  if (filledIngredients.length === 0) {
    errors.ingredients = 'Adicione pelo menos um ingrediente.'
  }

  const filledSteps = values.steps.filter((s) => s.trim())
  if (filledSteps.length === 0) {
    errors.steps = 'Adicione pelo menos um passo do preparo.'
  }

  return errors
}

export function formValuesToPayload(values: RecipeFormValues) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    ingredients: serializeListField(values.ingredients),
    preparationSteps: serializeListField(values.steps),
    videoUrl: values.videoUrl.trim(),
    thumbnailUrl: values.thumbnailUrl.trim(),
    categoryId: values.categoryId,
  }
}

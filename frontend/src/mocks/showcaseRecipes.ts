import type { Recipe } from '../types/recipe'
import { getMockRecipe } from './recipes'

/** Cards da landing — exemplos fixos, não vinculados ao acervo do usuário. */
export const SHOWCASE_ITEMS = [
  {
    id: 1,
    title: 'Risotto alla Milanese',
    tag: 'Primo',
    image: 'https://images.unsplash.com/photo-1476124366831-5abc798835d9?w=600&q=80',
  },
  {
    id: 2,
    title: 'Pasta al Pomodoro',
    tag: 'Classico',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
  },
  {
    id: 3,
    title: 'Tiramisù Classico',
    tag: 'Dolce',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
  },
] as const

export const SHOWCASE_RECIPE_IDS: readonly number[] = SHOWCASE_ITEMS.map((item) => item.id)

export function isShowcaseRecipeId(id: number): boolean {
  return SHOWCASE_RECIPE_IDS.includes(id)
}

/** Conteúdo completo da receita de exemplo (somente ids do showcase). */
export function getShowcaseRecipe(id: number): Recipe | undefined {
  if (!isShowcaseRecipeId(id)) return undefined
  return getMockRecipe(id)
}

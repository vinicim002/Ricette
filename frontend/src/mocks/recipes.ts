import type { Recipe, RecipeSummary } from '../types/recipe'

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Risotto alla Milanese',
    description:
      'Um clássico milanês cremoso, perfumado com açafrão e manteiga. O segredo está no caldo quente adicionado aos poucos e no stirring constante até atingir a consistência ondulada.',
    ingredients: [
      '320g de arbóreo',
      '1L de caldo de legumes quente',
      '1 colher de chá de açafrão',
      '80g de manteiga',
      '1 cebola pequena picada',
      '100ml de vinho branco seco',
      '60g de parmesão ralado',
      'Sal e pimenta a gosto',
    ],
    steps: [
      'Refogue a cebola na manteiga até ficar translúcida.',
      'Adicione o arroz e toste por 2 minutos, mexendo sempre.',
      'Despeje o vinho e deixe evaporar completamente.',
      'Adicione o caldo, uma concha por vez, mexendo até absorver antes da próxima.',
      'Incorpore o açafrão diluído na metade do processo.',
      'Finalize com manteiga fria e parmesão fora do fogo. Sirva imediatamente.',
    ],
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1476124366831-5abc798835d9?w=800&q=80',
    createdAt: '2025-03-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Pasta al Pomodoro',
    description:
      'Simplicidade italiana em sua forma mais pura. Tomates maduros, alho dourado e manjericão fresco — menos é mais.',
    ingredients: [
      '400g de spaghetti',
      '800g de tomates pelati',
      '4 dentes de alho',
      'Azeite extra virgem',
      'Manjericão fresco',
      'Sal',
    ],
    steps: [
      'Cozinhe a pasta em água bem salgada até al dente.',
      'Em uma panela, aqueça o azeite e doure levemente o alho.',
      'Adicione os tomates e cozinhe em fogo médio por 15 minutos.',
      'Escorra a pasta reservando um copo da água do cozimento.',
      'Misture a pasta ao molho, ajustando com a água reservada se necessário.',
      'Finalize com manjericão e azeite cru.',
    ],
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    createdAt: '2025-02-28T14:30:00Z',
  },
  {
    id: 3,
    title: 'Tiramisù Classico',
    description:
      'A sobremesa italiana por excelência. Camadas de biscoito champagne embebido em espresso, creme de mascarpone aveludado e cacau amargo.',
    ingredients: [
      '500g de mascarpone',
      '4 ovos (gemas e claras separadas)',
      '100g de açúcar',
      '300ml de espresso frio',
      '200g de biscoitos savoiardi',
      'Cacau em pó amargo',
      'Licor de café (opcional)',
    ],
    steps: [
      'Bata as gemas com o açúcar até ficarem claras e cremosas.',
      'Incorpore o mascarpone delicadamente.',
      'Bata as claras em neve e dobre ao creme.',
      'Mergulhe rapidamente os biscoitos no café frio.',
      'Monte camadas alternadas de creme e biscoitos em uma travessa.',
      'Refrigere por no mínimo 6 horas. Polvilhe cacau antes de servir.',
    ],
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
    createdAt: '2025-01-10T09:00:00Z',
  },
  {
    id: 4,
    title: 'Osso Buco alla Milanese',
    description:
      'Vitela braseada lentamente com vinho branco, legumes e gremolata fresca. Um prato de domingo que pede paciência.',
    ingredients: [
      '4 ossobocos de vitela',
      '2 cenouras picadas',
      '1 cebola picada',
      '1 talo de aipo',
      '400ml de vinho branco',
      '500ml de caldo de carne',
      'Farinha para empanar',
      'Gremolata: limão, alho e salsinha',
    ],
    steps: [
      'Empane os ossobocos na farinha e sele em fogo alto até dourar.',
      'Refogue os legumes na mesma panela.',
      'Retorne a carne, adicione vinho e deixe reduzir pela metade.',
      'Cubra com caldo e cozinhe tampado por 2 horas em fogo baixo.',
      'Prepare a gremolata misturando limão, alho e salsinha picada.',
      'Sirva com polenta e gremolata por cima.',
    ],
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    createdAt: '2024-12-05T18:00:00Z',
  },
  {
    id: 5,
    title: 'Focaccia Genovese',
    description:
      'Pão achatado macio por dentro, crocante por fora, com azeite generoso e sal grosso. Perfeita para acompanhar antipasti.',
    ingredients: [
      '500g de farinha de trigo',
      '10g de sal',
      '7g de fermento biológico seco',
      '350ml de água morna',
      'Azeite extra virgem',
      'Sal grosso',
      'Alecrim fresco',
    ],
    steps: [
      'Misture fermento, água e metade da farinha. Deixe descansar 30 min.',
      'Incorpore sal e farinha restante. Sove por 10 minutos.',
      'Primeira fermentação: 2 horas em local morno.',
      'Estique a massa em assadeira untada com azeite.',
      'Faça covinhas com os dedos, regue com azeite e sal grosso.',
      'Asse a 220°C por 20–25 minutos até dourar.',
    ],
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1604068540190-6a8c840b478a?w=800&q=80',
    createdAt: '2024-11-20T11:00:00Z',
  },
  {
    id: 6,
    title: 'Panna Cotta ai Frutti di Bosco',
    description:
      'Creme sedoso de baunilha com calda de frutas vermelhas. Leve, elegante e surpreendentemente simples.',
    ingredients: [
      '500ml de creme de leite',
      '80g de açúcar',
      '1 pote de gelatina incolor',
      '1 fava de baunilha',
      '200g de frutas vermelhas',
      '2 colheres de açúcar',
    ],
    steps: [
      'Aqueça o creme com açúcar e baunilha sem ferver.',
      'Hidrate e dissolva a gelatina conforme instruções do pacote.',
      'Misture ao creme e despeje em forminhas.',
      'Refrigere por 4 horas até firmar.',
      'Cozinhe as frutas com açúcar até formar calda.',
      'Desenforme e sirva com a calda por cima.',
    ],
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1488477181941-6420a0291777?w=800&q=80',
    createdAt: '2024-10-08T16:45:00Z',
  },
]

export function toSummary(recipe: Recipe): RecipeSummary {
  return {
    id: recipe.id,
    title: recipe.title,
    thumbnailUrl: recipe.thumbnailUrl,
    createdAt: recipe.createdAt,
  }
}

export function getMockRecipes(search?: string): RecipeSummary[] {
  const summaries = MOCK_RECIPES.map(toSummary)
  if (!search?.trim()) return summaries
  const term = search.toLowerCase()
  return summaries.filter((r) => r.title.toLowerCase().includes(term))
}

export function getMockRecipe(id: number): Recipe | undefined {
  return MOCK_RECIPES.find((r) => r.id === id)
}

/** Simula latência de rede para exibir skeleton loading */
export function mockDelay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface MockRecipePayload {
  title: string
  description: string
  ingredients: string
  preparationSteps: string
  videoUrl: string
  thumbnailUrl: string
}

function splitLines(value: string): string[] {
  if (!value.trim()) return []
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function createMockRecipe(payload: MockRecipePayload): Recipe {
  const id = Math.max(0, ...MOCK_RECIPES.map((r) => r.id)) + 1
  const recipe: Recipe = {
    id,
    title: payload.title,
    description: payload.description,
    ingredients: splitLines(payload.ingredients),
    steps: splitLines(payload.preparationSteps),
    videoUrl: payload.videoUrl,
    thumbnailUrl: payload.thumbnailUrl,
    createdAt: new Date().toISOString(),
  }
  MOCK_RECIPES.unshift(recipe)
  return recipe
}

export function updateMockRecipe(id: number, payload: MockRecipePayload): Recipe {
  const index = MOCK_RECIPES.findIndex((r) => r.id === id)
  if (index === -1) {
    throw new Error('Receita não encontrada.')
  }
  const existing = MOCK_RECIPES[index]
  const updated: Recipe = {
    ...existing,
    title: payload.title,
    description: payload.description,
    ingredients: splitLines(payload.ingredients),
    steps: splitLines(payload.preparationSteps),
    videoUrl: payload.videoUrl,
    thumbnailUrl: payload.thumbnailUrl,
  }
  MOCK_RECIPES[index] = updated
  return updated
}

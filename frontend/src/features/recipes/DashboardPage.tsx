import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AppHeader, AppHeaderLink } from '../../components/layout/AppHeader'
import { Button } from '../../components/ui/Button'
import { Fab } from '../../components/ui/Fab'
import { Input } from '../../components/ui/Input'
import { RecipeCardSkeleton } from '../../components/ui/Skeleton'
import { DashboardCategoryFolder } from '../categories/DashboardCategoryFolder'
import { useCategoryTree } from '../../hooks/useCategories'
import { useRecipes } from '../../hooks/useRecipes'
import { toastFromError, toastSuccess } from '../../lib/toast'
import { RecipeCard } from './RecipeCard'

export function DashboardPage() {
  const {
    tree: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategoryTree()
  const { recipes, loading, error, search, setSearch, refetch, deleteRecipe } = useRecipes()

  const uncategorizedRecipes = useMemo(
    () => recipes.filter((r) => r.categoryId == null),
    [recipes],
  )

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    return recipes
  }, [recipes, search])

  const showSearchResults = search.trim().length > 0

  async function handleDelete(id: number, title: string) {
    try {
      await deleteRecipe(id)
      toastSuccess(`"${title}" foi excluída.`)
      void refetchCategories()
    } catch (err) {
      toastFromError(err, 'Erro ao excluir receita.')
    }
  }

  const totalRecipes = recipes.length

  return (
    <div className="min-h-screen">
      <AppHeader title="Ricette" subtitle="Minhas receitas">
        <AppHeaderLink to="/admin/categorias">Gerenciar pastas</AppHeaderLink>
        <AppHeaderLink to="/">← Início</AppHeaderLink>
      </AppHeader>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="animate-fade-in-up mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-3xl text-text md:text-4xl">Dashboard</h2>
            <p className="mt-1 text-sm text-text-muted">
              {loading || categoriesLoading
                ? 'Carregando...'
                : `${totalRecipes} receita${totalRecipes !== 1 ? 's' : ''} no total`}
            </p>
          </div>
          <div className="w-full sm:max-w-xs">
            <Input
              type="search"
              placeholder="Buscar receitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar receitas"
            />
          </div>
        </div>

        {showSearchResults ? (
          <section className="mb-12">
            <h3 className="mb-4 font-heading text-2xl text-text">Resultados da busca</h3>
            {error && (
              <div className="mb-6 rounded-sm border border-secondary/30 bg-secondary/10 px-4 py-4 text-sm text-secondary">
                <p>{error}</p>
                <Button variant="ghost" onClick={refetch} className="mt-3 !px-3 !py-1.5 !text-[10px]">
                  Tentar novamente
                </Button>
              </div>
            )}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              <p className="text-sm text-text-muted">Nenhuma receita encontrada.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onDelete={(id) => handleDelete(id, recipe.title)}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="mb-10 rounded-sm border border-border bg-surface/30 p-4 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="font-heading text-2xl text-primary">Pastas</h3>
                <Link
                  to="/admin/categorias"
                  className="text-xs uppercase tracking-widest text-text-muted hover:text-primary"
                >
                  + Nova pasta
                </Link>
              </div>

              {categoriesLoading ? (
                <p className="text-sm text-text-muted">Carregando pastas...</p>
              ) : categoriesError ? (
                <div className="space-y-3">
                  <p className="text-sm text-secondary">{categoriesError}</p>
                  <Button variant="ghost" onClick={refetchCategories} className="!text-[10px]">
                    Tentar novamente
                  </Button>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-sm text-text-muted">
                  Nenhuma pasta ainda.{' '}
                  <Link to="/admin/categorias" className="text-primary hover:opacity-80">
                    Criar a primeira pasta
                  </Link>
                </p>
              ) : (
                <div className="divide-y divide-border/50">
                  {categories.map((node) => (
                    <DashboardCategoryFolder key={node.id} node={node} />
                  ))}
                </div>
              )}
            </section>

            {!loading && uncategorizedRecipes.length > 0 && (
              <section>
                <h3 className="mb-4 font-heading text-2xl text-text">
                  Sem pasta
                  <span className="ml-2 text-sm font-normal uppercase tracking-widest text-text-muted">
                    {uncategorizedRecipes.length} receita
                    {uncategorizedRecipes.length !== 1 ? 's' : ''}
                  </span>
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {uncategorizedRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onDelete={(id) => handleDelete(id, recipe.title)}
                    />
                  ))}
                </div>
              </section>
            )}

            {!categoriesLoading && categories.length === 0 && !loading && totalRecipes === 0 && (
              <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border py-16 text-center">
                <p className="font-heading text-2xl text-text-muted">Nenhuma receita ainda</p>
                <p className="mt-2 text-sm text-text-muted/70">
                  Crie uma pasta ou adicione sua primeira receita.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Fab to="/recipes/new" />
    </div>
  )
}

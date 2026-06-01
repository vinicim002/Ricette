import { Link, useParams } from 'react-router-dom'
import { AppHeader, AppHeaderLink } from '../../components/layout/AppHeader'
import { Button } from '../../components/ui/Button'
import { toastFromError, toastSuccess } from '../../lib/toast'
import { RecipeCardSkeleton } from '../../components/ui/Skeleton'
import { useCategoryBrowse } from '../../hooks/useCategoryBrowse'
import { useRecipes } from '../../hooks/useRecipes'
import { RecipeCard } from '../recipes/RecipeCard'
import { CategoryBreadcrumb } from './CategoryBreadcrumb'

export function CategoryBrowsePage() {
  const params = useParams()
  const pathSlug = (params['*'] ?? '').replace(/^\/+|\/+$/g, '')

  const { category, children, breadcrumb, loading, error, refetch, isRoot } =
    useCategoryBrowse(pathSlug)
  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
    deleteRecipe,
    refetch: refetchRecipes,
  } = useRecipes({ categoryId: category?.id })

  const title = isRoot ? 'Categorias' : category?.name ?? 'Categoria'

  return (
    <div className="min-h-screen">
      <AppHeader
        title={title}
        subtitle={!isRoot && category?.description ? category.description : undefined}
      >
        <AppHeaderLink to="/dashboard">Dashboard</AppHeaderLink>
        <AppHeaderLink to="/admin/categorias">Gerenciar</AppHeaderLink>
      </AppHeader>

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 md:px-8">
        {!isRoot && breadcrumb.length > 0 && (
          <CategoryBreadcrumb items={breadcrumb} />
        )}

        {loading ? (
          <p className="text-sm text-text-muted">Carregando categorias...</p>
        ) : error ? (
          <div className="rounded-sm border border-secondary/30 bg-secondary/10 px-4 py-4">
            <p className="text-sm text-secondary">{error}</p>
            <Button variant="ghost" onClick={refetch} className="mt-3 !px-3 !py-1.5 !text-[10px]">
              Tentar novamente
            </Button>
          </div>
        ) : (
          <>
            {children.length > 0 && (
              <section>
                <h2 className="mb-4 font-heading text-2xl text-text">
                  {isRoot ? 'Categorias principais' : 'Subcategorias'}
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {children.map((child) => (
                    <li key={child.id}>
                      <Link
                        to={`/categorias/${child.pathSlug}`}
                        className="flex items-center justify-between rounded-sm border border-border bg-surface/40 px-4 py-4 transition-colors hover:border-primary/30 hover:bg-surface/70"
                      >
                        <span className="font-heading text-xl text-text hover:text-primary">
                          {child.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-text-muted">
                          {child.recipeCount} receita{child.recipeCount !== 1 ? 's' : ''}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!isRoot && category && (
              <section>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-heading text-2xl text-text">Receitas nesta categoria</h2>
                  <Link
                    to={`/recipes/new?categoryId=${category.id}`}
                    className="text-xs uppercase tracking-widest text-primary hover:opacity-80"
                  >
                    + Adicionar receita
                  </Link>
                </div>

                {recipesError && (
                  <p className="mb-4 text-sm text-secondary">{recipesError}</p>
                )}

                {recipesLoading ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <RecipeCardSkeleton key={i} />
                    ))}
                  </div>
                ) : recipes.length === 0 ? (
                  <p className="rounded-sm border border-dashed border-border py-12 text-center text-sm text-text-muted">
                    Nenhuma receita nesta categoria ainda.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onDelete={async (id) => {
                          try {
                            await deleteRecipe(id)
                            toastSuccess('Receita excluída.')
                            refetchRecipes()
                          } catch (err) {
                            toastFromError(err, 'Erro ao excluir receita.')
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {isRoot && children.length === 0 && (
              <p className="text-sm text-text-muted">
                Nenhuma categoria cadastrada.{' '}
                <Link to="/admin/categorias" className="text-primary hover:opacity-80">
                  Criar categorias
                </Link>
              </p>
            )}
          </>
        )}
      </main>
    </div>
  )
}

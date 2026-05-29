import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Fab } from '../../components/ui/Fab'
import { Input } from '../../components/ui/Input'
import { RecipeCardSkeleton } from '../../components/ui/Skeleton'
import { useRecipes } from '../../hooks/useRecipes'
import { RecipeCard } from './RecipeCard'

export function DashboardPage() {
  const { recipes, loading, error, search, setSearch, refetch, deleteRecipe } = useRecipes()

  async function handleDelete(id: number) {
    try {
      await deleteRecipe(id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir receita.')
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8 md:py-5">
          <div>
            <h1 className="font-heading text-2xl text-primary md:text-3xl">Ricette</h1>
            <p className="text-xs text-text-muted">Minhas receitas</p>
          </div>
          <Link
            to="/"
            className="text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-primary"
          >
            ← Início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="animate-fade-in-up mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-3xl text-text md:text-4xl">Dashboard</h2>
            <p className="mt-1 text-sm text-text-muted">
              {loading ? 'Carregando...' : `${recipes.length} receita${recipes.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="w-full sm:max-w-xs">
            <Input
              type="search"
              placeholder="Buscar por título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar receitas"
            />
          </div>
        </div>

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
            {Array.from({ length: 6 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="animate-fade-in flex flex-col items-center justify-center rounded-sm border border-dashed border-border py-24 text-center">
            <p className="font-heading text-2xl text-text-muted">
              {search ? 'Nenhuma receita encontrada' : 'Nenhuma receita ainda'}
            </p>
            <p className="mt-2 text-sm text-text-muted/70">
              {search ? 'Tente outro termo de busca.' : 'Adicione sua primeira receita em vídeo.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
              >
                <RecipeCard recipe={recipe} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Fab to="/recipes/new" />
    </div>
  )
}

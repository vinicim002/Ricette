import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { useRecipe } from '../../hooks/useRecipes'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

interface RecipePageProps {
  /** Visualização pública de exemplo (landing), sem editar/excluir. */
  variant?: 'app' | 'demo'
}

export function RecipePage({ variant = 'app' }: RecipePageProps) {
  const isDemo = variant === 'demo'
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const recipeId = Number(id)
  const { recipe, loading, error, refetch } = useRecipe(recipeId, { showcaseOnly: isDemo })

  if (!id || Number.isNaN(recipeId)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-muted">{isDemo ? 'Exemplo inválido.' : 'Receita inválida.'}</p>
      </div>
    )
  }

  const backHref = isDemo ? '/#exemplos' : '/dashboard'
  const backLabel = isDemo ? '← Voltar aos exemplos' : '← Dashboard'

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-8">
          <Link
            to={backHref}
            className="text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-primary"
          >
            {backLabel}
          </Link>
          {!isDemo && recipe && (
            <Link
              to={`/recipes/${recipe.id}/edit`}
              className="text-xs uppercase tracking-widest text-primary transition-opacity hover:opacity-80"
            >
              Editar
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
        {isDemo && (
          <div className="animate-fade-in mb-8 rounded-sm border border-primary/25 bg-primary/10 px-4 py-3 text-center text-sm text-text-muted">
            <span className="text-primary">Demonstração</span> — assim ficam suas receitas salvas no
            Ricette.{' '}
            <Link to="/login" className="text-primary underline-offset-2 hover:underline">
              Entrar
            </Link>{' '}
            para criar o seu acervo.
          </div>
        )}

        {loading ? (
          <RecipePageSkeleton />
        ) : error ? (
          <div className="rounded-sm border border-secondary/30 bg-secondary/10 px-6 py-8 text-center">
            <p className="text-secondary">{error}</p>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="ghost" onClick={refetch}>
                Tentar novamente
              </Button>
              <Button variant="ghost" onClick={() => navigate(isDemo ? '/' : '/dashboard')}>
                Voltar
              </Button>
            </div>
          </div>
        ) : recipe ? (
          <article className="animate-fade-in-up">
            <header className="mb-8">
              <time className="text-xs uppercase tracking-widest text-text-muted" dateTime={recipe.createdAt}>
                {formatDate(recipe.createdAt)}
              </time>
              <h1 className="mt-2 font-heading text-4xl leading-tight text-text md:text-6xl">
                {recipe.title}
              </h1>
            </header>

            <div className="mb-12 overflow-hidden rounded-sm border border-border bg-surface">
              {recipe.videoUrl ? (
                <video
                  src={recipe.videoUrl}
                  controls
                  playsInline
                  poster={recipe.thumbnailUrl || undefined}
                  className="aspect-video w-full bg-bg object-contain"
                >
                  Seu navegador não suporta reprodução de vídeo.
                </video>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-bg">
                  <p className="text-sm text-text-muted">Vídeo indisponível</p>
                </div>
              )}
            </div>

            <div className="space-y-12">
              <section>
                <h2 className="mb-4 font-heading text-2xl text-primary md:text-3xl">Descrição</h2>
                <p className="text-sm leading-relaxed text-text-muted md:text-base">
                  {recipe.description || 'Sem descrição.'}
                </p>
              </section>

              <section>
                <h2 className="mb-4 font-heading text-2xl text-primary md:text-3xl">Ingredientes</h2>
                {recipe.ingredients?.length > 0 ? (
                  <ul className="space-y-2">
                    {recipe.ingredients.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-start gap-3 border-b border-border py-2 text-sm last:border-0"
                      >
                        <span className="mt-0.5 text-primary" aria-hidden="true">
                          ◆
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-text-muted">Nenhum ingrediente cadastrado.</p>
                )}
              </section>

              <section>
                <h2 className="mb-4 font-heading text-2xl text-primary md:text-3xl">Modo de Preparo</h2>
                {recipe.steps?.length > 0 ? (
                  <ol className="space-y-6">
                    {recipe.steps.map((step, index) => (
                      <li key={`step-${index}`} className="flex gap-4">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-primary/10 font-heading text-lg text-primary">
                          {index + 1}
                        </span>
                        <p className="pt-1 text-sm leading-relaxed text-text md:text-base">{step}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-text-muted">Nenhum passo cadastrado.</p>
                )}
              </section>
            </div>

            {isDemo && (
              <div className="mt-16 rounded-sm border border-border bg-surface/60 px-6 py-8 text-center">
                <p className="font-heading text-2xl text-text">Gostou do formato?</p>
                <p className="mt-2 text-sm text-text-muted">
                  Crie seu acervo pessoal com vídeos, ingredientes e passo a passo.
                </p>
                <Link
                  to="/login"
                  className="mt-6 inline-flex items-center justify-center rounded-sm bg-primary px-8 py-3 font-body text-xs uppercase tracking-widest text-bg transition-all hover:bg-primary/90"
                >
                  Começar agora
                </Link>
              </div>
            )}
          </article>
        ) : null}
      </main>
    </div>
  )
}

function RecipePageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-3/4" />
      </div>
      <Skeleton className="aspect-video w-full" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}

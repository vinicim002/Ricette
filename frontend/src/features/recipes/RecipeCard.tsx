import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { toastConfirm } from '../../lib/toast'
import type { RecipeSummary } from '../../types/recipe'

interface RecipeCardProps {
  recipe: RecipeSummary
  onDelete: (id: number) => void
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  async function handleDelete(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const confirmed = await toastConfirm({
      message: `Deseja excluir "${recipe.title}"? Esta ação não pode ser desfeita.`,
    })
    if (confirmed) {
      onDelete(recipe.id)
    }
  }

  return (
    <article className="group relative overflow-hidden rounded-sm border border-border bg-surface transition-all duration-200 hover:border-primary/25 hover:shadow-[0_0_32px_rgba(240,192,64,0.05)]">
      <Link to={`/recipes/${recipe.id}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-bg">
          {recipe.thumbnailUrl ? (
            <img
              src={recipe.thumbnailUrl}
              alt={recipe.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-surface">
              <span className="font-heading text-2xl text-text-muted/30">Ricette</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="p-4">
          <h3 className="font-heading text-xl leading-tight text-text transition-colors group-hover:text-primary">
            {recipe.title}
          </h3>
          <time className="mt-1 block text-xs text-text-muted" dateTime={recipe.createdAt}>
            {formatDate(recipe.createdAt)}
          </time>
        </div>
      </Link>

      <div className="absolute right-3 top-3 flex gap-1.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
        <Link
          to={`/recipes/${recipe.id}/edit`}
          aria-label={`Editar ${recipe.title}`}
          className="flex size-8 items-center justify-center rounded-sm border border-border bg-bg/80 text-text-muted backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Link>
        <button
          type="button"
          aria-label={`Excluir ${recipe.title}`}
          onClick={handleDelete}
          className="flex size-8 items-center justify-center rounded-sm border border-border bg-bg/80 text-text-muted backdrop-blur-sm transition-colors hover:border-secondary/40 hover:text-secondary"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </article>
  )
}

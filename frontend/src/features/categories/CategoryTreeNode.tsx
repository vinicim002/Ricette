import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import type { Category } from '../../types/category'

export type CategoryTreeAction =
  | 'add-child'
  | 'add-recipe'
  | 'edit'
  | 'delete'
  | 'move'

interface CategoryTreeNodeProps {
  node: Category
  depth?: number
  onAction: (action: CategoryTreeAction, category: Category) => void
}

export function CategoryTreeNode({ node, depth = 0, onAction }: CategoryTreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2)
  const hasChildren = (node.children?.length ?? 0) > 0

  return (
    <div className="select-none">
      <div
        className="group flex items-center gap-2 rounded-sm border border-transparent px-2 py-2 hover:border-border hover:bg-surface/60"
        style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex size-6 shrink-0 items-center justify-center text-text-muted hover:text-primary"
          aria-label={expanded ? 'Recolher' : 'Expandir'}
        >
          {hasChildren ? (expanded ? '▾' : '▸') : '·'}
        </button>

        <Link
          to={`/categorias/${node.pathSlug}`}
          className="min-w-0 flex-1 truncate font-heading text-lg text-text transition-colors hover:text-primary"
        >
          {node.name}
        </Link>

        <span className="hidden text-[10px] uppercase tracking-widest text-text-muted sm:inline">
          {node.recipeCount} no total
        </span>

        <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
          <Button
            type="button"
            variant="ghost"
            className="!px-2 !py-1 !text-[9px]"
            onClick={() => onAction('add-child', node)}
          >
            + Sub
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="!px-2 !py-1 !text-[9px]"
            onClick={() => onAction('add-recipe', node)}
          >
            + Receita
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="!px-2 !py-1 !text-[9px]"
            onClick={() => onAction('move', node)}
          >
            Mover
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="!px-2 !py-1 !text-[9px]"
            onClick={() => onAction('edit', node)}
          >
            Editar
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="!px-2 !py-1 !text-[9px]"
            onClick={() => onAction('delete', node)}
          >
            Excluir
          </Button>
        </div>
      </div>

      {expanded &&
        node.children?.map((child) => (
          <CategoryTreeNode key={child.id} node={child} depth={depth + 1} onAction={onAction} />
        ))}
    </div>
  )
}

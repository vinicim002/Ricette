import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Category } from '../../types/category'

interface DashboardCategoryFolderProps {
  node: Category
  depth?: number
}

function fileLabel(count: number): string {
  return `${count} receita${count !== 1 ? 's' : ''}`
}

export function DashboardCategoryFolder({ node, depth = 0 }: DashboardCategoryFolderProps) {
  const [expanded, setExpanded] = useState(depth < 1)
  const hasChildren = (node.children?.length ?? 0) > 0

  return (
    <div>
      <div
        className="group flex items-center gap-2 rounded-sm border border-transparent py-2 pr-2 transition-colors hover:border-border hover:bg-surface/50"
        style={{ paddingLeft: `${depth * 1.25 + 0.25}rem` }}
      >
        <button
          type="button"
          onClick={() => hasChildren && setExpanded((v) => !v)}
          className="flex size-7 shrink-0 items-center justify-center text-text-muted hover:text-primary"
          aria-label={hasChildren ? (expanded ? 'Recolher pasta' : 'Expandir pasta') : undefined}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            <span className="text-sm">{expanded ? '▾' : '▸'}</span>
          ) : (
            <FolderIcon className="opacity-60" />
          )}
        </button>

        <FolderIcon className="shrink-0 text-primary/80" />

        <Link
          to={`/categorias/${node.pathSlug}`}
          className="min-w-0 flex-1 truncate font-heading text-lg text-text transition-colors hover:text-primary"
        >
          {node.name}
        </Link>

        <span className="shrink-0 rounded-sm border border-border bg-bg/60 px-2 py-0.5 text-[10px] uppercase tracking-widest text-text-muted">
          {fileLabel(node.recipeCount)}
        </span>
      </div>

      {expanded &&
        node.children?.map((child) => (
          <DashboardCategoryFolder key={child.id} node={child} depth={depth + 1} />
        ))}
    </div>
  )
}

function FolderIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.12"
      />
    </svg>
  )
}

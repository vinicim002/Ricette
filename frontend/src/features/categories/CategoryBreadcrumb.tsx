import { Link } from 'react-router-dom'
import type { BreadcrumbItem } from '../../types/category'

interface CategoryBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function CategoryBreadcrumb({ items }: CategoryBreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs">
      <Link to="/categorias" className="uppercase tracking-widest text-text-muted hover:text-primary">
        Categorias
      </Link>
      {items.map((item, index) => (
        <span key={item.id} className="flex items-center gap-2">
          <span className="text-text-muted/50" aria-hidden="true">
            →
          </span>
          {index === items.length - 1 ? (
            <span className="uppercase tracking-widest text-primary">{item.name}</span>
          ) : (
            <Link
              to={`/categorias/${item.pathSlug}`}
              className="uppercase tracking-widest text-text-muted hover:text-primary"
            >
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}

import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface AppHeaderProps {
  title: string
  subtitle?: string
  children?: ReactNode
}

export function AppHeader({ title, subtitle, children }: AppHeaderProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8 md:py-5">
        <div className="min-w-0">
          <h1 className="truncate font-heading text-2xl text-primary md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-xs text-text-muted">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 md:gap-4">
          {children}
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-primary"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}

export function AppHeaderLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-primary"
    >
      {children}
    </Link>
  )
}

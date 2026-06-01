import { Link } from 'react-router-dom'
export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-text-muted">404</p>
      <h1 className="mt-4 font-heading text-4xl text-text">Página não encontrada</h1>
      <p className="mt-3 max-w-md text-sm text-text-muted">
        O endereço que você acessou não existe ou foi movido.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-sm bg-primary px-5 py-2.5 text-xs uppercase tracking-widest text-bg transition-colors hover:bg-primary/90"
        >
          Ir ao início
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-sm border border-border px-5 py-2.5 text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-text"
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'

interface FabProps {
  to: string
  label?: string
}

export function Fab({ to, label = 'Adicionar receita' }: FabProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-bg shadow-[0_4px_24px_rgba(240,192,64,0.35)] transition-all duration-200 hover:scale-105 hover:bg-primary/90 hover:shadow-[0_6px_32px_rgba(240,192,64,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:bottom-8 md:right-8"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </Link>
  )
}

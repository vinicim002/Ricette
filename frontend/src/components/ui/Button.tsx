import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-bg hover:bg-primary/90 focus-visible:ring-primary/50 disabled:opacity-50',
  secondary:
    'bg-secondary text-text hover:bg-secondary/90 focus-visible:ring-secondary/50 disabled:opacity-50',
  ghost:
    'bg-transparent text-text-muted hover:text-text hover:bg-white/5 border border-border focus-visible:ring-white/20',
  danger:
    'bg-transparent text-secondary hover:bg-secondary/10 border border-secondary/30 focus-visible:ring-secondary/30',
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-body text-xs uppercase tracking-widest transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span
          className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
          role="status"
        />
      )}
      {children}
    </button>
  )
}

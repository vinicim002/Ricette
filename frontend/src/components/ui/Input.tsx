import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs uppercase tracking-widest text-text-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-sm border bg-surface px-4 py-3 font-body text-sm text-text placeholder:text-text-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          error ? 'border-secondary/60' : 'border-border hover:border-white/15'
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-secondary" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

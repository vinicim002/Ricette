import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`rounded-sm border border-border bg-surface transition-all duration-200 ${
        onClick ? 'cursor-pointer text-left hover:border-primary/30 hover:shadow-[0_0_24px_rgba(240,192,64,0.06)]' : ''
      } ${className}`}
    >
      {children}
    </Tag>
  )
}

import { useEffect, useState } from 'react'
import { flattenCategories } from '../../lib/categoryUtils'
import { api } from '../../services/api'
import type { Category } from '../../types/category'

interface CategorySelectProps {
  value: number | null
  onChange: (categoryId: number | null) => void
  label?: string
}

export function CategorySelect({ value, onChange, label = 'Categoria' }: CategorySelectProps) {
  const [options, setOptions] = useState<Array<{ id: number; label: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (import.meta.env.VITE_USE_API !== 'true') {
        setLoading(false)
        return
      }

      try {
        const tree: Category[] = await api.getCategoryTree()
        if (!cancelled) setOptions(flattenCategories(tree))
      } catch {
        if (!cancelled) setOptions([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  if (import.meta.env.VITE_USE_API !== 'true') return null

  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-widest text-text-muted">
        {label}
      </label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        disabled={loading}
        className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text disabled:opacity-50"
      >
        <option value="">— Sem categoria —</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

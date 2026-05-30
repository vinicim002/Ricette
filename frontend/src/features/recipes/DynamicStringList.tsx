import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

interface DynamicStringListProps {
  label: string
  addLabel: string
  placeholder: string
  items: string[]
  onChange: (items: string[]) => void
  error?: string
  numbered?: boolean
}

export function DynamicStringList({
  label,
  addLabel,
  placeholder,
  items,
  onChange,
  error,
  numbered = false,
}: DynamicStringListProps) {
  function updateItem(index: number, value: string) {
    const next = [...items]
    next[index] = value
    onChange(next)
  }

  function addItem() {
    onChange([...items, ''])
  }

  function removeItem(index: number) {
    if (items.length <= 1) {
      onChange([''])
      return
    }
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <fieldset className="space-y-4">
      <legend className="font-heading text-2xl text-primary md:text-3xl">{label}</legend>
      {error && (
        <p className="text-xs text-secondary" role="alert">
          {error}
        </p>
      )}

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2 sm:gap-3">
            {numbered && (
              <span
                className="mt-3 flex size-8 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-primary/10 font-heading text-lg text-primary"
                aria-hidden="true"
              >
                {index + 1}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <Input
                aria-label={`${label} ${index + 1}`}
                placeholder={placeholder}
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => removeItem(index)}
              className="mt-0.5 shrink-0 !px-3"
              aria-label={`Remover item ${index + 1}`}
            >
              ×
            </Button>
          </li>
        ))}
      </ul>

      <Button type="button" variant="ghost" onClick={addItem} className="!text-[10px]">
        + {addLabel}
      </Button>
    </fieldset>
  )
}

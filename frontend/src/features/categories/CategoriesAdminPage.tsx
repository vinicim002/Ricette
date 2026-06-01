import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader, AppHeaderLink } from '../../components/layout/AppHeader'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { useCategoryTree } from '../../hooks/useCategories'
import { flattenCategoriesForParentSelect } from '../../lib/categoryUtils'
import { toastError } from '../../lib/toast'
import { toastConfirm } from '../../lib/toast'
import { toastFromError, toastSuccess } from '../../lib/toast'
import type { Category, CategoryStatus } from '../../types/category'
import { CategoryTreeNode, type CategoryTreeAction } from './CategoryTreeNode'

type FormMode = 'create-root' | 'create-child' | 'edit' | null

export function CategoriesAdminPage() {
  const navigate = useNavigate()
  const { tree, loading, error, refetch, createCategory, updateCategory, deleteCategory } =
    useCategoryTree()

  const [formMode, setFormMode] = useState<FormMode>(null)
  const [selected, setSelected] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<CategoryStatus>('ACTIVE')
  const [parentId, setParentId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const parentSelectOptions = useMemo(
    () => flattenCategoriesForParentSelect(tree, selected?.id ?? null),
    [tree, selected?.id],
  )

  function openCreateRoot() {
    setFormMode('create-root')
    setSelected(null)
    setParentId(null)
    setName('')
    setDescription('')
    setStatus('ACTIVE')
  }

  function handleAction(action: CategoryTreeAction, category: Category) {
    if (action === 'add-child') {
      setFormMode('create-child')
      setSelected(category)
      setParentId(category.id)
      setName('')
      setDescription('')
      setStatus('ACTIVE')
      return
    }
    if (action === 'add-recipe') {
      navigate(`/recipes/new?categoryId=${category.id}`)
      return
    }
    if (action === 'edit' || action === 'move') {
      setFormMode('edit')
      setSelected(category)
      setParentId(category.parentId)
      setName(category.name)
      setDescription(category.description ?? '')
      setStatus(category.status)
      return
    }
    if (action === 'delete') {
      void (async () => {
        const ok = await toastConfirm({
          message: `Excluir "${category.name}"? Mova subcategorias e receitas antes de confirmar.`,
        })
        if (!ok) return
        try {
          await deleteCategory(category.id)
          toastSuccess('Categoria excluída.')
        } catch (err) {
          toastFromError(err, 'Não foi possível excluir.')
        }
      })()
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toastError('Informe o nome da categoria.')
      return
    }

    setSaving(true)
    try {
      if (formMode === 'edit' && selected) {
        await updateCategory(selected.id, {
          name: name.trim(),
          description: description.trim(),
          parentId,
          status,
        })
        toastSuccess('Categoria atualizada.')
      } else {
        await createCategory({
          name: name.trim(),
          description: description.trim(),
          parentId: formMode === 'create-child' ? parentId : null,
          status,
        })
        toastSuccess('Categoria criada.')
      }

      setFormMode(null)
      setSelected(null)
    } catch (err) {
      toastFromError(err, 'Não foi possível salvar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader title="Categorias" subtitle="Gerenciamento hierárquico">
        <AppHeaderLink to="/dashboard">Dashboard</AppHeaderLink>
        <AppHeaderLink to="/categorias">Navegar</AppHeaderLink>
      </AppHeader>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[1fr_320px] md:px-8">
        <section className="min-w-0 rounded-sm border border-border bg-surface/40 p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-heading text-2xl text-text">Árvore de categorias</h2>
            <Button type="button" onClick={openCreateRoot}>
              + Principal
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-text-muted">Carregando...</p>
          ) : error ? (
            <div className="space-y-3">
              <p className="text-sm text-secondary">{error}</p>
              <Button variant="ghost" onClick={refetch}>
                Tentar novamente
              </Button>
            </div>
          ) : tree.length === 0 ? (
            <p className="text-sm text-text-muted">Nenhuma categoria. Crie a primeira acima.</p>
          ) : (
            <div className="space-y-1">
              {tree.map((node) => (
                <CategoryTreeNode key={node.id} node={node} onAction={handleAction} />
              ))}
            </div>
          )}
        </section>

        <aside className="h-fit rounded-sm border border-border bg-surface/40 p-6">
          {formMode ? (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="font-heading text-xl text-primary">
                {formMode === 'edit'
                  ? 'Editar categoria'
                  : formMode === 'create-child'
                    ? 'Nova subcategoria'
                    : 'Nova categoria principal'}
              </h3>

              {formMode === 'edit' && (
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-widest text-text-muted">
                    Categoria pai
                  </label>
                  <select
                    value={parentId ?? ''}
                    onChange={(e) =>
                      setParentId(e.target.value ? Number(e.target.value) : null)
                    }
                    className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text"
                  >
                    <option value="">— Raiz —</option>
                    {parentSelectOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <Input
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Textarea
                label="Descrição (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px]"
              />
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-text-muted">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CategoryStatus)}
                  className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text"
                >
                  <option value="ACTIVE">Ativa</option>
                  <option value="INACTIVE">Inativa</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" loading={saving} className="flex-1">
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setFormMode(null)
                    setSelected(null)
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-sm leading-relaxed text-text-muted">
              Selecione uma ação na árvore ou crie uma categoria principal. Estrutura ilimitada:
              Doces → Bolos → Bolos de Chocolate → Receitas.
            </p>
          )}
        </aside>
      </main>
    </div>
  )
}

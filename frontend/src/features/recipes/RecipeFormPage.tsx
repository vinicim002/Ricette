import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Skeleton } from '../../components/ui/Skeleton'
import { Textarea } from '../../components/ui/Textarea'
import { useRecipeForm } from '../../hooks/useRecipeForm'
import { toastFromError, toastSuccess } from '../../lib/toast'
import type { RecipeFormValues } from '../../lib/recipeForm'
import { CategorySelect } from '../categories/CategorySelect'
import { DynamicStringList } from './DynamicStringList'

export function RecipeFormPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isEditRoute = id != null && id !== 'new'
  const recipeId = isEditRoute ? Number(id) : undefined
  const isInvalidEditId = isEditRoute && Number.isNaN(recipeId!)
  const queryCategoryId = searchParams.get('categoryId')
  const initialCategoryId =
    queryCategoryId && !Number.isNaN(Number(queryCategoryId)) ? Number(queryCategoryId) : null

  const { values, setValues, errors, loading, submitting, loadError, isEdit, submit } =
    useRecipeForm({
      recipeId: isInvalidEditId ? undefined : recipeId,
      initialCategoryId: isEditRoute ? undefined : initialCategoryId,
    })

  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const videoObjectUrl = useRef<string | null>(null)
  const thumbnailObjectUrl = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (videoObjectUrl.current) URL.revokeObjectURL(videoObjectUrl.current)
      if (thumbnailObjectUrl.current) URL.revokeObjectURL(thumbnailObjectUrl.current)
    }
  }, [])

  function patchValues(patch: Partial<RecipeFormValues>) {
    setValues((prev) => ({ ...prev, ...patch }))
  }

  function handleVideoFile(file: File | null) {
    if (videoObjectUrl.current) {
      URL.revokeObjectURL(videoObjectUrl.current)
      videoObjectUrl.current = null
    }
    if (!file) {
      setVideoPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    videoObjectUrl.current = url
    setVideoPreview(url)
  }

  function handleThumbnailFile(file: File | null) {
    if (thumbnailObjectUrl.current) {
      URL.revokeObjectURL(thumbnailObjectUrl.current)
      thumbnailObjectUrl.current = null
    }
    if (!file) {
      setThumbnailPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    thumbnailObjectUrl.current = url
    setThumbnailPreview(url)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      const savedId = await submit()
      if (savedId == null) return
      toastSuccess(isEdit ? 'Receita atualizada.' : 'Receita criada.')
      navigate(`/recipes/${savedId}`)
    } catch (err) {
      toastFromError(err, 'Não foi possível salvar a receita.')
    }
  }

  const previewVideoSrc = videoPreview || values.videoUrl.trim() || null
  const previewThumbSrc = thumbnailPreview || values.thumbnailUrl.trim() || null

  if (isInvalidEditId) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-text-muted">Receita inválida.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-28">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 md:px-8">
          <Link
            to="/dashboard"
            className="text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-primary"
          >
            ← Dashboard
          </Link>
          <span className="text-xs uppercase tracking-widest text-text-muted">
            {isEdit ? 'Editar' : 'Nova receita'}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        {loading ? (
          <RecipeFormSkeleton />
        ) : loadError ? (
          <div className="rounded-sm border border-secondary/30 bg-secondary/10 px-6 py-8 text-center">
            <p className="text-secondary">{loadError}</p>
            <Link
              to="/dashboard"
              className="mt-4 inline-block text-xs uppercase tracking-widest text-primary hover:opacity-80"
            >
              Voltar ao dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="animate-fade-in-up space-y-12" noValidate>
            <header>
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
                {isEdit ? 'Modifica la ricetta' : 'Nuova ricetta'}
              </p>
              <h1 className="mt-2 font-heading text-4xl text-text md:text-5xl">
                {isEdit ? 'Editar receita' : 'Adicionar receita'}
              </h1>
            </header>

            <section className="space-y-6 rounded-sm border border-border bg-surface/40 p-6 md:p-8">
              <h2 className="font-heading text-2xl text-primary">Informações básicas</h2>

              <Input
                label="Título"
                value={values.title}
                onChange={(e) => patchValues({ title: e.target.value })}
                placeholder="Ex.: Risotto alla Milanese"
                error={errors.title}
                required
                maxLength={255}
              />

              <Textarea
                label="Descrição"
                value={values.description}
                onChange={(e) => patchValues({ description: e.target.value })}
                placeholder="Conte a história do prato, dicas e contexto..."
              />

              <CategorySelect
                value={values.categoryId}
                onChange={(categoryId) => patchValues({ categoryId })}
              />
            </section>

            <section className="space-y-6 rounded-sm border border-border bg-surface/40 p-6 md:p-8">
              <h2 className="font-heading text-2xl text-primary">Mídia</h2>
              <p className="text-sm text-text-muted">
                Use URLs do Cloudinary ou S3. O upload direto de arquivo gera prévia local; para salvar,
                informe a URL hospedada do vídeo.
              </p>

              <Input
                label="URL do vídeo"
                type="url"
                value={values.videoUrl}
                onChange={(e) => patchValues({ videoUrl: e.target.value })}
                placeholder="https://res.cloudinary.com/..."
                error={errors.videoUrl}
              />

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-text-muted">
                  Arquivo de vídeo (prévia)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleVideoFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-sm border border-border bg-surface px-4 py-3 font-body text-sm text-text file:mr-4 file:rounded-sm file:border-0 file:bg-primary/15 file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-widest file:text-primary"
                />
              </div>

              {previewVideoSrc && (
                <div className="overflow-hidden rounded-sm border border-border">
                  <video
                    src={previewVideoSrc}
                    controls
                    playsInline
                    className="aspect-video w-full bg-bg object-contain"
                  />
                </div>
              )}

              <Input
                label="URL da thumbnail"
                type="url"
                value={values.thumbnailUrl}
                onChange={(e) => patchValues({ thumbnailUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                error={errors.thumbnailUrl}
              />

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-text-muted">
                  Imagem de capa (prévia)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleThumbnailFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-sm border border-border bg-surface px-4 py-3 font-body text-sm text-text file:mr-4 file:rounded-sm file:border-0 file:bg-primary/15 file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-widest file:text-primary"
                />
              </div>

              {previewThumbSrc && (
                <div className="overflow-hidden rounded-sm border border-border">
                  <img
                    src={previewThumbSrc}
                    alt="Prévia da thumbnail"
                    className="aspect-video w-full object-cover"
                  />
                </div>
              )}
            </section>

            <section className="rounded-sm border border-border bg-surface/40 p-6 md:p-8">
              <DynamicStringList
                label="Ingredientes"
                addLabel="Adicionar ingrediente"
                placeholder="Ex.: 320g de arbóreo"
                items={values.ingredients}
                onChange={(ingredients) => patchValues({ ingredients })}
                error={errors.ingredients}
              />
            </section>

            <section className="rounded-sm border border-border bg-surface/40 p-6 md:p-8">
              <DynamicStringList
                label="Modo de preparo"
                addLabel="Adicionar passo"
                placeholder="Descreva o passo..."
                items={values.steps}
                onChange={(steps) => patchValues({ steps })}
                error={errors.steps}
                numbered
              />
            </section>

            <div className="sticky bottom-0 -mx-4 border-t border-border bg-bg/95 px-4 py-4 backdrop-blur-md md:-mx-8 md:px-8">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(isEdit && recipeId ? `/recipes/${recipeId}` : '/dashboard')}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" loading={submitting}>
                  {isEdit ? 'Salvar alterações' : 'Criar receita'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}

function RecipeFormSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}

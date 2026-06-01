import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { toastFromError, toastSuccess } from '../../lib/toast'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, logout, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
      return
    }
    logout()
  }, [isAuthenticated, logout, navigate, from])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email.trim(), password.trim())
      toastSuccess('Login realizado com sucesso.')
      navigate(from, { replace: true })
    } catch (err) {
      toastFromError(err, 'E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="animate-fade-in-up w-full max-w-md">
        <div className="mb-10 text-center">
          <Link to="/" className="font-heading text-3xl text-primary transition-opacity hover:opacity-80">
            Ricette
          </Link>
          <p className="mt-2 text-sm text-text-muted">Acesse sua cozinha digital</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-sm border border-border bg-surface p-8"
        >
          <Input
            label="E-mail"
            type="email"
            name="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
          />

          <Input
            label="Senha"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" loading={loading} className="w-full">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center">
          <Link to="/" className="text-xs text-text-muted transition-colors hover:text-primary">
            ← Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  )
}

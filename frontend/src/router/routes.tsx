import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'
import { LandingPage } from '../features/landing/LandingPage'
import { DashboardPage } from '../features/recipes/DashboardPage'
import { RecipePage } from '../features/recipes/RecipePage'

function RecipeFormPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <p className="text-center text-text-muted">
        Formulário de receita em breve.
        <br />
        <Link to="/dashboard" className="mt-2 inline-block text-primary hover:underline">
          Voltar ao dashboard
        </Link>
      </p>
    </div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/recipes/:id" element={<RecipePage />} />
      <Route path="/recipes/new" element={<RecipeFormPlaceholder />} />
      <Route path="/recipes/:id/edit" element={<RecipeFormPlaceholder />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

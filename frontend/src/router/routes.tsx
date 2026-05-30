import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'
import { PrivateRoute } from '../features/auth/PrivateRoute'
import { LandingPage } from '../features/landing/LandingPage'
import { DashboardPage } from '../features/recipes/DashboardPage'
import { RecipeFormPage } from '../features/recipes/RecipeFormPage'
import { RecipePage } from '../features/recipes/RecipePage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/recipes/new"
        element={
          <PrivateRoute>
            <RecipeFormPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/recipes/:id/edit"
        element={
          <PrivateRoute>
            <RecipeFormPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/recipes/:id"
        element={
          <PrivateRoute>
            <RecipePage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

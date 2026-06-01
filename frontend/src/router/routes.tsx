import { Route, Routes } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'
import { PrivateRoute } from '../features/auth/PrivateRoute'
import { LandingPage } from '../features/landing/LandingPage'
import { DashboardPage } from '../features/recipes/DashboardPage'
import { CategoriesAdminPage } from '../features/categories/CategoriesAdminPage'
import { CategoryBrowsePage } from '../features/categories/CategoryBrowsePage'
import { RecipeFormPage } from '../features/recipes/RecipeFormPage'
import { RecipePage } from '../features/recipes/RecipePage'
import { NotFoundPage } from '../features/errors/NotFoundPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/exemplo/:id" element={<RecipePage variant="demo" />} />
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
      <Route
        path="/categorias/*"
        element={
          <PrivateRoute>
            <CategoryBrowsePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/categorias"
        element={
          <PrivateRoute>
            <CategoriesAdminPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

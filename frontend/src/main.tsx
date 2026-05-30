import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './components/ui/ToastProvider'
import { AuthProvider } from './features/auth/AuthProvider'
import './styles/global.css'
import { AppRouter } from './router/routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <ToastProvider />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

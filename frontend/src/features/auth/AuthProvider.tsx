import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isTokenExpired } from '../../lib/jwt'
import { api, AUTH_LOGOUT_EVENT, clearToken, getToken, setToken } from '../../services/api'
import { AuthContext } from './auth-context'

function hasValidSession(): boolean {
  const token = getToken()
  if (!token) return false
  if (isTokenExpired(token)) {
    clearToken()
    return false
  }
  return true
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(hasValidSession)

  const logout = useCallback(() => {
    clearToken()
    setIsAuthenticated(false)
  }, [])

  useEffect(() => {
    const onUnauthorized = () => logout()
    window.addEventListener(AUTH_LOGOUT_EVENT, onUnauthorized)
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, onUnauthorized)
  }, [logout])

  const login = useCallback(async (email: string, password: string) => {
    const { token } = await api.login(email.trim(), password.trim())
    if (isTokenExpired(token)) {
      clearToken()
      throw new Error('Token inválido recebido do servidor.')
    }
    setToken(token)
    setIsAuthenticated(true)
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import { describe, expect, it } from 'vitest'
import { isTokenExpired } from './jwt'

function buildToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.signature`
}

describe('isTokenExpired', () => {
  it('returns false for token without exp', () => {
    const token = buildToken({ sub: 'admin@test.local' })
    expect(isTokenExpired(token)).toBe(false)
  })

  it('returns true for expired token', () => {
    const token = buildToken({ exp: Math.floor(Date.now() / 1000) - 60 })
    expect(isTokenExpired(token)).toBe(true)
  })

  it('returns false for valid token', () => {
    const token = buildToken({ exp: Math.floor(Date.now() / 1000) + 3600 })
    expect(isTokenExpired(token)).toBe(false)
  })

  it('returns true for malformed token', () => {
    expect(isTokenExpired('invalid')).toBe(true)
  })
})

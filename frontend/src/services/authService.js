const BASE_URL = 'http://localhost:3000'

// ── Login admin ──────────────────────────────────────
export async function loginAdmin(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Identifiants incorrects')
  const data = await res.json()
  _saveSession(data)
  return data
}

// ── Login personne ───────────────────────────────────
export async function loginPersonne(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Identifiants incorrects')
  const data = await res.json()
  _saveSession(data)
  return data
}

// ── Rafraîchir le token ──────────────────────────────────
export async function refreshAccessToken() {
  const refresh_token = localStorage.getItem('scholarly_refresh')
  if (!refresh_token) throw new Error('Pas de refresh token')

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token }),
  })
  if (!res.ok) {
    logout()
    throw new Error('Session expirée')
  }
  const data = await res.json()
  localStorage.setItem('scholarly_token', data.access)
  localStorage.setItem('scholarly_refresh', data.refresh)
  return data.access
}

// ── Utilitaires ──────────────────────────────────────
function _saveSession(data) {
  localStorage.setItem('scholarly_token',   data.access)
  localStorage.setItem('scholarly_refresh',  data.refresh)
  localStorage.setItem('scholarly_user',     JSON.stringify(data.user))
}

export function logout() {
  localStorage.removeItem('scholarly_token')
  localStorage.removeItem('scholarly_refresh')
  localStorage.removeItem('scholarly_user')
}

export function getUser() {
  const u = localStorage.getItem('scholarly_user')
  return u ? JSON.parse(u) : null
}

export function isAuthenticated() {
  return !!localStorage.getItem('scholarly_token')
}

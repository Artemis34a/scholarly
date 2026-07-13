const BASE_URL = 'http://localhost:3000'

// ── Login admin ──────────────────────────────────────
export async function loginAdmin(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('Identifiants incorrects')
  const data = await res.json()
  _saveSession(data)
  return data
}

// ── Login personne (enseignant, parent, directeur) ───
export async function loginPersonne(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('Identifiants incorrects')
  const data = await res.json()
  _saveSession(data)
  return data
}

// ── Login élève ───────────────────────────────────────
export async function loginEleve(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login/eleve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('Identifiants incorrects')
  const data = await res.json()
  _saveSession(data)
  return data
}

// ── Utilitaires ──────────────────────────────────────
function _saveSession(data) {
  localStorage.setItem('scholarly_token', data.access_token)
  localStorage.setItem('scholarly_user', JSON.stringify(data.user))
}

export function logout() {
  localStorage.removeItem('scholarly_token')
  localStorage.removeItem('scholarly_user')
}

export function getUser() {
  const u = localStorage.getItem('scholarly_user')
  return u ? JSON.parse(u) : null
}

export function isAuthenticated() {
  return !!localStorage.getItem('scholarly_token')
}

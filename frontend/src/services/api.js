const BASE_URL = 'http://localhost:3000'

// Ajouter cet import en haut du fichier :
import { refreshAccessToken, logout } from './authService'

function getToken() {
  return localStorage.getItem('scholarly_token')
}

function authHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Remplacer la fonction request() par :
async function request(method, path, body, retry = true) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  // Token expiré → tenter un refresh automatique une seule fois
  if (res.status === 401 && retry) {
    try {
      await refreshAccessToken()          // nouveau access stocké
      return request(method, path, body, false)  // rejouer la requête
    } catch {
      logout()
      window.location.href = '/login'
      return
    }
  }

  if (res.status === 401) {
    logout()
    window.location.href = '/login'
    return
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message?.message || err?.message || `Erreur ${res.status}`)
  }
  return res.json()
}

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  delete: (path)        => request('DELETE', path),
}

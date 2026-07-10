import { api } from './api'

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}`.trim() !== '') {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const evaluationsService = {
  epreuves: {
    // Sans parametre : tableau complet (menus deroulants). Avec { page, limit } : reponse paginee.
    findAll: (params) => api.get(`/evaluations/epreuves${buildQuery(params)}`),
    findOne: (id) => api.get(`/evaluations/epreuves/${id}`),
    getStats: (id) => api.get(`/evaluations/epreuves/${id}/stats`),
    create: (data) => api.post('/evaluations/epreuves', data),
    update: (id, data) => api.put(`/evaluations/epreuves/${id}`, data),
    remove: (id) => api.delete(`/evaluations/epreuves/${id}`),
  },
  notes: {
    findAll: (params) => api.get(`/evaluations/notes${buildQuery(params)}`),
    findOne: (id) => api.get(`/evaluations/notes/${id}`),
    create: (data) => api.post('/evaluations/notes', data),
    update: (id, data) => api.put(`/evaluations/notes/${id}`, data),
    remove: (id) => api.delete(`/evaluations/notes/${id}`),
  },
  getMoyenneCours: (idEleve, idCours) => api.get(`/evaluations/eleves/${idEleve}/moyenne-cours/${idCours}`),
  getBulletin: (idEleve) => api.get(`/evaluations/eleves/${idEleve}/bulletin`),
}

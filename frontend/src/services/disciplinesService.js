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

export const disciplinesService = {
  types: {
    // Sans parametre : tableau complet (menus deroulants). Avec { page, limit } : reponse paginee.
    findAll: (params) => api.get(`/discipline${buildQuery(params)}`),
    findOne: (id) => api.get(`/discipline/${id}`),
    create: (data) => api.post('/discipline', data),
    update: (id, data) => api.put(`/discipline/${id}`, data),
    remove: (id) => api.delete(`/discipline/${id}`),
  },
  rapports: {
    findAll: (params) => api.get(`/discipline/rapports${buildQuery(params)}`),
    findOne: (id) => api.get(`/discipline/rapports/${id}`),
    create: (data) => api.post('/discipline/rapports', data),
    update: (id, data) => api.put(`/discipline/rapports/${id}`, data),
    remove: (id) => api.delete(`/discipline/rapports/${id}`),
  },
  getHistorique: (idEleve) => api.get(`/discipline/eleves/${idEleve}/historique`),
}

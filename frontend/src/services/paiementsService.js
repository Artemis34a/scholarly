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

export const paiementsService = {
  modes: {
    findAll: (search) => api.get(`/paiements/modes${buildQuery({ search })}`),
    findOne: (id) => api.get(`/paiements/modes/${id}`),
    create: (data) => api.post('/paiements/modes', data),
    update: (id, data) => api.put(`/paiements/modes/${id}`, data),
    remove: (id) => api.delete(`/paiements/modes/${id}`),
  },
  tranches: {
    findAll: (search) => api.get(`/paiements/tranches${buildQuery({ search })}`),
    findOne: (id) => api.get(`/paiements/tranches/${id}`),
    create: (data) => api.post('/paiements/tranches', data),
    update: (id, data) => api.put(`/paiements/tranches/${id}`, data),
    remove: (id) => api.delete(`/paiements/tranches/${id}`),
  },
  scolarites: {
    findAll: (params) => api.get(`/paiements/scolarites${buildQuery(params)}`),
    findOne: (id) => api.get(`/paiements/scolarites/${id}`),
    getSolde: (id) => api.get(`/paiements/scolarites/${id}/solde`),
    create: (data) => api.post('/paiements/scolarites', data),
    update: (id, data) => api.put(`/paiements/scolarites/${id}`, data),
    remove: (id) => api.delete(`/paiements/scolarites/${id}`),
  },
  findAll: (params) => api.get(`/paiements${buildQuery(params)}`),
  findOne: (id) => api.get(`/paiements/${id}`),
  create: (data) => api.post('/paiements', data),
  update: (id, data) => api.put(`/paiements/${id}`, data),
  remove: (id) => api.delete(`/paiements/${id}`),
  getHistorique: (idEleve) => api.get(`/paiements/eleves/${idEleve}/historique`),
}

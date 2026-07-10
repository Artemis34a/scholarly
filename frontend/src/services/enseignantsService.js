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

export const enseignantsService = {
  findAll:   (params)     => api.get(`/enseignants${buildQuery(params)}`),
  findActifs:()           => api.get('/enseignants/actifs'),
  findOne:   (id)         => api.get(`/enseignants/${id}`),
  create:    (data)       => api.post('/enseignants', data),
  update:    (id, data)   => api.put(`/enseignants/${id}`, data),
  remove:    (id)         => api.delete(`/enseignants/${id}`),
  addAffectation:   (id, data)             => api.post(`/enseignants/${id}/affectations`, data),
  removeAffectation:(id, idAffectation)    => api.delete(`/enseignants/${id}/affectations/${idAffectation}`),
}

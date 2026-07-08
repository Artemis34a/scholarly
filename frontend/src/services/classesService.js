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

export const classesService = {
  findAll:        (params)     => api.get(`/classes${buildQuery(params)}`),
  findOne:        (id)         => api.get(`/classes/${id}`),
  create:         (data)       => api.post('/classes', data),
  update:         (id, data)   => api.put(`/classes/${id}`, data),
  remove:         (id)         => api.delete(`/classes/${id}`),
  findEleves:     (id)         => api.get(`/classes/${id}/eleves`),
  getTitulaire:   (id)         => api.get(`/classes/${id}/titulaire`),
  assignTitulaire:(id, idPers) => api.put(`/classes/${id}/titulaire`, { idPers }),
  removeTitulaire:(id)         => api.delete(`/classes/${id}/titulaire`),
}

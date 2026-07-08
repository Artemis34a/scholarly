import { api } from './api'

export const frequenteService = {
  findAll:   ()         => api.get('/frequente'),
  findBySalle: (idSalle) => api.get(`/frequente?classe=${idSalle}`),
  findOne:   (id)       => api.get(`/frequente/${id}`),
  create:    (data)     => api.post('/frequente', data),
  update:    (id, data) => api.put(`/frequente/${id}`, data),
  remove:    (id)       => api.delete(`/frequente/${id}`),
}

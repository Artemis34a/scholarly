import { api } from './api'
export const elevesService = {
  findAll:   ()           => api.get('/eleves'),
  findActifs:()           => api.get('/eleves/actifs'),
  findOne:   (matricule)  => api.get(`/eleves/${matricule}`),
  create:    (data)       => api.post('/eleves', data),
  update:    (matricule, data) => api.put(`/eleves/${matricule}`, data),
  remove:    (matricule)  => api.delete(`/eleves/${matricule}`),
}

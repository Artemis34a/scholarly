import { api } from './api'
export const trimestresService = {
  findAll:  ()        => api.get('/trimestres'),
  findOne:  (id)      => api.get(`/trimestres/${id}`),
  create:   (data)    => api.post('/trimestres', data),
  update:   (id, data)=> api.put(`/trimestres/${id}`, data),
  remove:   (id)      => api.delete(`/trimestres/${id}`),
}

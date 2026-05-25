import { api } from './api'
export const anneesService = {
  findAll:  ()        => api.get('/annees-academiques'),
  findOne:  (id)      => api.get(`/annees-academiques/${id}`),
  create:   (data)    => api.post('/annees-academiques', data),
  update:   (id, data)=> api.put(`/annees-academiques/${id}`, data),
  remove:   (id)      => api.delete(`/annees-academiques/${id}`),
}

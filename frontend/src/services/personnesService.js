import { api } from './api'
export const personnesService = {
  findAll:  ()        => api.get('/personnes'),
  findOne:  (id)      => api.get(`/personnes/${id}`),
  create:   (data)    => api.post('/personnes', data),
  update:   (id, data)=> api.put(`/personnes/${id}`, data),
  remove:   (id)      => api.delete(`/personnes/${id}`),
}

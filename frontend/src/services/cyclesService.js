import { api } from './api'
export const cyclesService = {
  findAll:  ()        => api.get('/cycles'),
  findOne:  (id)      => api.get(`/cycles/${id}`),
  create:   (data)    => api.post('/cycles', data),
  update:   (id, data)=> api.put(`/cycles/${id}`, data),
  remove:   (id)      => api.delete(`/cycles/${id}`),
}

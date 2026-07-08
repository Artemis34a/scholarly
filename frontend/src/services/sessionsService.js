import { api } from './api'
export const sessionsService = {
  findAll:  ()        => api.get('/sessions'),
  findOne:  (id)      => api.get(`/sessions/${id}`),
  create:   (data)    => api.post('/sessions', data),
  update:   (id, data)=> api.put(`/sessions/${id}`, data),
  remove:   (id)      => api.delete(`/sessions/${id}`),
}

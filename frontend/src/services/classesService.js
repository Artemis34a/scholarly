import { api } from './api'
export const classesService = {
  findAll:  ()        => api.get('/classes'),
  findOne:  (id)      => api.get(`/classes/${id}`),
  create:   (data)    => api.post('/classes', data),
  update:   (id, data)=> api.put(`/classes/${id}`, data),
  remove:   (id)      => api.delete(`/classes/${id}`),
}

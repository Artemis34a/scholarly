import { api } from './api'
export const coursService = {
  findAll:   ()        => api.get('/cours'),
  findActifs:()        => api.get('/cours/actifs'),
  findOne:   (id)      => api.get(`/cours/${id}`),
  create:    (data)    => api.post('/cours', data),
  update:    (id, data)=> api.put(`/cours/${id}`, data),
  remove:    (id)      => api.delete(`/cours/${id}`),
}

import { api } from './api'
export const villesService = {
  findAll:   ()        => api.get('/villes-naissance'),
  findActives:()       => api.get('/villes-naissance/actives'),
  findOne:   (id)      => api.get(`/villes-naissance/${id}`),
  create:    (data)    => api.post('/villes-naissance', data),
  update:    (id, data)=> api.put(`/villes-naissance/${id}`, data),
  remove:    (id)      => api.delete(`/villes-naissance/${id}`),
}

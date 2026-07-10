import { api } from './api'

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}`.trim() !== '') {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const coursService = {
  // Sans parametre : tableau complet (utilise par les menus deroulants Eleves/Classes).
  // Avec { page, limit } : reponse paginee { data, total, page, limit, totalPages }.
  findAll:   (params)  => api.get(`/cours${buildQuery(params)}`),
  findActifs:()        => api.get('/cours/actifs'),
  findOne:   (id)      => api.get(`/cours/${id}`),
  create:    (data)    => api.post('/cours', data),
  update:    (id, data)=> api.put(`/cours/${id}`, data),
  remove:    (id)      => api.delete(`/cours/${id}`),
  addClasse:   (idCours, data)     => api.post(`/cours/${idCours}/classes`, data),
  removeClasse:(idCours, idClasse) => api.delete(`/cours/${idCours}/classes/${idClasse}`),
}

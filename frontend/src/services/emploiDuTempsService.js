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

export const emploiDuTempsService = {
  // Sans parametre : tableau complet. Avec { page, limit } : reponse paginee.
  findAll:  (params)     => api.get(`/emploi-de-temps${buildQuery(params)}`),
  findOne:  (id)         => api.get(`/emploi-de-temps/${id}`),
  create:   (data)       => api.post('/emploi-de-temps', data),
  update:   (id, data)   => api.put(`/emploi-de-temps/${id}`, data),
  remove:   (id)         => api.delete(`/emploi-de-temps/${id}`),
  getGrilleClasse:     (idClasse) => api.get(`/emploi-de-temps/classes/${idClasse}`),
  getGrilleEnseignant: (idPers)   => api.get(`/emploi-de-temps/enseignants/${idPers}`),
  getGrilleEleve:      (idEleve)  => api.get(`/emploi-de-temps/eleves/${idEleve}`),
}

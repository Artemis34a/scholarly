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

export const elevesService = {
  findAll:   (params)     => {
    if (typeof params === 'string') {
      return api.get(`/eleves${buildQuery({ search: params })}`)
    }

    return api.get(`/eleves${buildQuery(params)}`)
  },
  search:    (search)     => api.get(`/eleves${buildQuery({ search })}`),
  findActifs:()           => api.get('/eleves/actifs'),
  findOne:   (id)         => api.get(`/eleves/${id}`),
  create:    (data)       => api.post('/eleves', data),
  update:    (id, data)   => api.put(`/eleves/${id}`, data),
  remove:    (id)         => api.delete(`/eleves/${id}`),
}

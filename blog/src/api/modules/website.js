import request from '../request'

export const getWebsites = () => request.get('/websites')
export const deleteWebsite = (id) => request.delete(`/websites/${id}`)
export const createWebsite = (data) => request.post('/websites', data)
export const updateWebsite = (id,data) => request.put(`/websites/${id}`,data)
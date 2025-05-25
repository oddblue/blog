import request from '../request'

export const getUpdate = () => request.get('/update')
export const createUpdate = (data) => request.post('/update', data)
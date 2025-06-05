import request from '../request'

export const getAllNotes = () => request.get('/notes')
export const getNoteById = (id) => request.get(`/notes/${id}`)
export const createNote = (data) => request.post('/notes', data)
export const updateNote = (id,data) => request.put(`/notes/${id}`,data)
export const deleteNote = (id) => request.delete(`/notes/${id}`)
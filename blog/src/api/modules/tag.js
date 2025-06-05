import request from '../request'

export const getAllTags = () => request.get('/tags')
export const getTagTree = () => request.get('/tags/tree')//获取文件夹树状结构
export const getAllTree = () => request.get('/tags/alltree')//获取文件夹和笔记树状结构
export const getTagById = (id) => request.get(`/tags/${id}`)//获取当前文件夹id下所有内容
export const createTag = (data) => request.post('/tags', data)//创建文件夹
export const updateTag = (id,data) => request.put(`/tags/${id}`,data)
export const deleteTag = (id) => request.delete(`/tags/${id}`)
export const getTopLevel = (id) => request.get(`/tags/getTopLevel/${id}`)//获取顶级文件夹
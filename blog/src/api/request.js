// src/api/request.js
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3000/api'||import.meta.env.VITE_API_BASE_URL , // 动态获取 API 基地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加 token 或其他请求头
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 统一处理响应数据
    return response.data
  },
  (error) => {
    // 统一处理错误
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        // 未授权，跳转登录
        window.location.href = '/login'
      } else if (status === 500) {
        console.error('Server error')
      }
    }
    return Promise.reject(error)
  }
)

export default request
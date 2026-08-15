import axios from 'axios'

const raw = (
  import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : import.meta.env.VITE_API_URL || 'https://stayease-3wzi.onrender.com/api'
).replace(/\/$/, '')
const baseURL = raw.endsWith('/api') ? raw : `${raw}/api`

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

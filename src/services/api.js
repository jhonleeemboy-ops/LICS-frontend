// src/services/api.js
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL

/**
 * Axios instance
 */
const apiClient = axios.create({
  // http://localhost:8000 + /api = http://localhost:8000/api
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

/**
 * Attach auth token automatically
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/**
 * Global error handler
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response

    const formattedError = {
      status: res?.status,
      message:
        res?.data?.message ||
        res?.data?.error ||
        error.message ||
        'Request failed',
      errors: res?.data?.errors || {},
    }

    console.error('API Error:', formattedError)
    return Promise.reject(formattedError)
  }
)

/**
 * CSRF uses full URL (no /api)
 */
export const initCsrf = () => {
  return axios.get(`${API_BASE}/sanctum/csrf-cookie`, {
    withCredentials: true,
    headers: {
      Accept: 'application/json',
    },
  })
}

/**
 * API methods
 */
export const api = {
  get: (endpoint, config = {}) =>
    apiClient.get(endpoint, config).then((res) => res.data),

  post: (endpoint, body, config = {}) =>
    apiClient.post(endpoint, body, config).then((res) => res.data),

  put: (endpoint, body, config = {}) =>
    apiClient.put(endpoint, body, config).then((res) => res.data),

  patch: (endpoint, body, config = {}) =>
    apiClient.patch(endpoint, body, config).then((res) => res.data),

  delete: (endpoint, config = {}) =>
    apiClient.delete(endpoint, config).then((res) => res.data),
}

export default apiClient

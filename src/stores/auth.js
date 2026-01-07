// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const saveAuthToStorage = () => {
    if (token.value && user.value) {
      localStorage.setItem('auth_token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
    } else {
      // if no token (e.g. lawyer registration), ensure nothing is stored
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }

  const clearAuthFromStorage = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const data = await api.post('/login', { email, password })

      // If backend blocked pending lawyer, it should throw 403 before here
      // but still make sure token exists
      if (!data.token) {
        throw new Error('No token returned from server')
      }

      token.value = data.token
      user.value = data.user
      isAuthenticated.value = true
      saveAuthToStorage()
      return true
    } catch (e) {
      console.error('Login error:', e)
      error.value = e.message || 'Login failed'
      // ensure not authenticated on error
      token.value = null
      user.value = null
      isAuthenticated.value = false
      clearAuthFromStorage()
      throw e
    } finally {
      loading.value = false
    }
  }

  const register = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const data = await api.post('/register', payload)

      // IMPORTANT:
      // - For clients, backend returns token → auto-login
      // - For lawyers, backend returns token = null → NOT logged in
      if (data.token) {
        token.value = data.token
        user.value = data.user
        isAuthenticated.value = true
      } else {
        token.value = null
        user.value = null
        isAuthenticated.value = false
      }

      saveAuthToStorage()
      return data
    } catch (e) {
      console.error('Register error:', e)
      error.value = e.message || 'Registration failed'
      token.value = null
      user.value = null
      isAuthenticated.value = false
      clearAuthFromStorage()
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null
    try {
      if (token.value) {
        await api.post('/logout')
      }
    } catch (e) {
      console.warn('Logout request failed, clearing local state anyway', e)
    } finally {
      user.value = null
      token.value = null
      isAuthenticated.value = false
      clearAuthFromStorage()
      loading.value = false
    }
  }

  const fetchMe = async () => {
    if (!token.value) return
    try {
      const data = await api.get('/me')
      user.value = data.user
      saveAuthToStorage()
    } catch (e) {
      console.error('Fetch me error:', e)
      if (e.status === 401) {
        await logout()
      }
    }
  }

  const checkAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
      fetchMe()
    }
  }

  return {
    user,
    isAuthenticated,
    token,
    loading,
    error,
    login,
    register,
    logout,
    fetchMe,
    checkAuth,
  }
})

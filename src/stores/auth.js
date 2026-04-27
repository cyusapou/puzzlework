import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))
  const loading = ref(false)
  const error = ref(null)
  
  const isLoggedIn = computed(() => !!user.value && !!token.value)

  async function register(username, email, password) {
    loading.value = true
    error.value = null
    try {
      const response = await api.register(username, email, password)
      token.value = response.token
      refreshToken.value = response.refreshToken
      user.value = response.user
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const response = await api.login(email, password)
      token.value = response.token
      refreshToken.value = response.refreshToken
      user.value = response.user
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return
    
    try {
      const response = await api.getMe()
      user.value = response.user
    } catch (err) {
      logout()
    }
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) {
      logout()
      return
    }
    
    try {
      const response = await api.refreshToken(refreshToken.value)
      token.value = response.token
      refreshToken.value = response.refreshToken
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
    } catch (err) {
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = null
    refreshToken.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  // Initialize auth state on store creation
  if (token.value) {
    fetchUser()
  }

  return { 
    user, 
    token, 
    loading, 
    error, 
    isLoggedIn, 
    register, 
    login, 
    logout, 
    fetchUser,
    refreshAccessToken 
  }
})

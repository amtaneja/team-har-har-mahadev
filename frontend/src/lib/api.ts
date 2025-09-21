import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for adk-api-server
  withCredentials: false, // Disable credentials for CORS
})

// Request interceptor for adding auth tokens, etc.
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors globally
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access')
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error:', error.response?.data)
    }
    return Promise.reject(error)
  }
)

// API service functions
export const adkApiServer = {
  // Submit user question to adk-api-server
  submitUserQuestion: async (data: {
    appName: string
    userId: string
    sessionId: string
    newMessage: {
      parts: {
        text: string
      }[],
      role: string
    }
  }) => {
    const response = await api.post('/run', data)
    return response.data
  },

  // Create a new session
  createSession: async (appName: string, userId: string, sessionId: string) => {
    const url = `/apps/${appName}/users/${userId}/sessions/${sessionId}`
    console.log('Creating session with URL:', url)
    
    const response = await api.post(url, {})
    
    console.log('Session creation response:', response.data)
    console.log('Full response object:', response)
    
    return response.data
  },
}

export default api

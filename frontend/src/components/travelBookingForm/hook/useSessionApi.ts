import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../../lib/api'

interface SessionResponse {
  session_id: string
  user_id: string
  app_name: string
  created_at?: string
  status?: string
  [key: string]: any
}

// API function for creating session
const createSessionApi = async ( appName: string, userId: string, sessionId: string ): Promise<SessionResponse> => {
  const url = `/apps/${appName}/users/${userId}/sessions/${sessionId}`
  console.log('Creating session with URL:', url)
  
  const response = await api.post(url, {})
  
  console.log('Session creation response:', response.data)
  console.log('Full response object:', response)
  
  return response.data
}

// Hook for creating session using React Query mutation
export const useCreateSession = ( appName: string, userId: string, sessionId: string ) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => createSessionApi( appName, userId, sessionId ),
    onSuccess: (data) => {
      console.log('Session created successfully:', data)
      // Invalidate and refetch session queries
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create session'
      console.error('Session creation error:', errorMessage)
      console.error('Full error object:', error)
    },
  })
}


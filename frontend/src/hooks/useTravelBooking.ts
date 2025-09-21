import { useMutation } from '@tanstack/react-query'
import { adkApiServer } from '@/lib/api'

interface AdkApiServerData {
  appName: string
  userId: string
  sessionId: string
  newMessage: {
    parts:{
      text: string
    }[],
    role: string
  }
}

export const useAdkApiServer = () => {
  return useMutation({
    mutationFn: (data: AdkApiServerData) => adkApiServer.submitUserQuestion(data),
    onSuccess: (data) => {
      console.log('User question submitted successfully:', data)
    },
    onError: (error) => {
      console.error('User question submission failed:', error)
    },
  })
}

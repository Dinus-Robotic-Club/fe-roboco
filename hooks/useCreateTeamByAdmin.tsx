import { createTeamsByAdmin } from '@/lib/api/team'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateTeamByAdmin = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation<unknown, Error, FormData>({
    mutationFn: (data: FormData) => createTeamsByAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      toast.success('Team created successfully')
      // Call optional callback for form reset
      if (onSuccessCallback) onSuccessCallback()
    },
    onError: (err) => {
      console.log('Error create teams', err.message)
      toast.error(err.message)
    },
  })
}

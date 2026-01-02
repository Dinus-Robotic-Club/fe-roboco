import { createTeams } from '@/lib/api/team'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation<unknown, Error, FormData>({
    mutationFn: (data: FormData) => createTeams(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      toast.success('Team created successfully')
    },
    onError: (err) => {
      console.log('Error create teams', err.message)
      toast.error(err.message)
    },
  })
}

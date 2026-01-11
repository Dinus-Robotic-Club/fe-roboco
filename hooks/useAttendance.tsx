import { updateAttendeance } from '@/lib/api/team'
import { IApiResponse } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useAttendance = () => {
  const queryClient = useQueryClient()

  return useMutation<IApiResponse<unknown>, Error, { token: string }>({
    mutationFn: ({ token }) => updateAttendeance(token),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['get-all-teams'] })
      toast.success(data.message)
    },
    onError: (err) => {
      console.log('Error update attendance', err.message)
      toast.error(err.message)
    },
  })
}

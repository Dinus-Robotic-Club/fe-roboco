import { updateStatusRegistration } from '@/lib/api/team'
import { IApiResponse } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
export const useUpdateStatusRegistration = () => {
  const queryClient = useQueryClient()

  return useMutation<IApiResponse<unknown>, unknown, { status: string; uid: string }>({
    mutationFn: ({ status, uid }) => updateStatusRegistration(status, uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-teams'] })
      toast.success('Status registration updated successfully')
    },
    onError: () => {
      toast.error('Failed to update status registration')
    },
  })
}

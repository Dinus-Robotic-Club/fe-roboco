import { updateStatusRegistration } from '@/lib/api/team'
import { IApiResponse } from '@/lib/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
export const useUpdateStatusRegistration = (slug: string) => {
  return useMutation<IApiResponse<unknown>, unknown, { status: string; uid: string }>({
    mutationKey: ['detail-tournament', slug],
    mutationFn: ({ status, uid }) => updateStatusRegistration(status, uid),
    onSuccess: () => {
      toast.success('Status registration updated successfully')
    },
    onError: () => {
      toast.error('Failed to update status registration')
    },
  })
}

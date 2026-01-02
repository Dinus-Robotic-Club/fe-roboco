import { forgotPassword } from '@/lib/api/forgot-reset'
import { IApiResponse } from '@/lib/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useForgotPassword = () => {
  return useMutation<IApiResponse<unknown>, Error, { email: string }>({
    mutationFn: ({ email }) => forgotPassword(email),

    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (err) => {
      console.log('Error send forgot password', err.message)
      toast.error(err.message)
    },
  })
}

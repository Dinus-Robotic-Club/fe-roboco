import { useMutation } from '@tanstack/react-query'
import { updateUser } from '../lib/api/user'
import { IApiResponse } from '@/lib/types'
import { toast } from 'sonner'

export const useUpdateUser = () => {
  return useMutation<IApiResponse<IUser[]>, Error, Partial<IRegisterUserInput>>({
    mutationKey: ['update-user'],
    mutationFn: (data) => updateUser(data),
    onSuccess: () => {
      toast.success('user berhasil di update')
    },
    onError: () => {
      toast.error('user gagal di update')
    },
  })
}

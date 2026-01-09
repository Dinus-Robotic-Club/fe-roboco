import { createUser } from '@/lib/api/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IRegisterUserInput) => createUser(data),
    onError: (error) => {
      console.log(error)
      toast.error('Gagal membuat user')
    },
    onSuccess: () => {
      toast.success('User berhasil dibuat')
      queryClient.invalidateQueries({ queryKey: ['all-user'] })
    },
  })
}

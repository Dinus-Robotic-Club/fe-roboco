import { createMatchRound } from '@/lib/api/match'
import { IApiResponse } from '@/lib/types'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'

export const useCreateMatchRound = () => {
  const { user } = useAuth()

  return useMutation<IApiResponse<IRound>, Error, { tourId: string; matchId: string }>({
    mutationFn: async ({ tourId, matchId }) => {
      if (!user?.accessToken) {
        throw new Error('Anda harus login untuk melakukan ini')
      }
      return await createMatchRound(tourId, matchId, user.accessToken)
    },
    onSuccess: (data) => {
      toast.success(`Rounde ${data.data?.roundNumber} berhasil dibuat`)
    },
    onError: (error) => {
      toast.error(`Gagal membuat ronde match: ${error.message}`)
    },
  })
}

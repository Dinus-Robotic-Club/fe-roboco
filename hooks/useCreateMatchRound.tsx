import { createMatchRound } from '@/lib/api/match'
import { IApiResponse } from '@/lib/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateMatchRound = () => {
  return useMutation<IApiResponse<IRound>, Error, { tourId: string; matchId: string }>({
    mutationFn: ({ tourId, matchId }) => createMatchRound(tourId, matchId),
    onSuccess: (data) => {
      toast.success(`Rounde ${data.data?.roundNumber} berhasil dibuat`)
    },

    onError: (error) => {
      toast.error(`Gagal membuat ronde match: ${error.message}`)
    },
  })
}

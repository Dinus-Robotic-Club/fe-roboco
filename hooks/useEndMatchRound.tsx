import { endMatchRound } from '@/lib/api/match'
import { IApiResponse } from '@/lib/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useEndMatchRound = () => {
  return useMutation<IApiResponse<unknown>, Error, { matchId: string }>({
    mutationFn: ({ matchId }) => endMatchRound(matchId),
    onSuccess() {
      toast.success(`Ronde berhasil diakhiri`)
    },
    onError: (error) => {
      toast.error(`Gagal mengakhiri ronde: ${error.message}`)
    },
  })
}

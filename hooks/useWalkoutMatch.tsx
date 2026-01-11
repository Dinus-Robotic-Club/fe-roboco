import { walkoutMatch } from '@/lib/api/match'
import { IApiResponse } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useWalkoutMatch = () => {
  const queryClient = useQueryClient()

  return useMutation<IApiResponse<unknown>, Error, { matchId: string; winnerId: string }>({
    mutationFn: ({ matchId, winnerId }) => walkoutMatch(matchId, winnerId),
    onSuccess() {
      toast.success('Walkout berhasil diproses')
      queryClient.invalidateQueries({ queryKey: ['match-group'] })
      queryClient.invalidateQueries({ queryKey: ['get-ongoing-match'] })
    },
    onError: (error) => {
      toast.error(`Gagal memproses walkout: ${error.message}`)
    },
  })
}

import { createMatchRound } from '@/lib/api/match'
import { IApiResponse } from '@/lib/types'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export const useCreateMatchRound = () => {
  const { data: session } = useSession()

  return useMutation<IApiResponse<IRound>, Error, { tourId: string; matchId: string }>({
    // ✅ VALIDASI PINDAH KE SINI
    mutationFn: async ({ tourId, matchId }) => {
      if (!session?.accessToken) {
        throw new Error('Anda harus login untuk melakukan ini')
      }
      return await createMatchRound(tourId, matchId, session.accessToken)
    },
    onSuccess: (data) => {
      toast.success(`Rounde ${data.data?.roundNumber} berhasil dibuat`)
    },
    onError: (error) => {
      toast.error(`Gagal membuat ronde match: ${error.message}`)
    },
  })
}

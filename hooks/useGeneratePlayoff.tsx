import { generatePlayoff } from '@/lib/api/playoff'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGeneratePlayoff = (tournamentId: string, slug: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['generate-playoff', tournamentId],
    mutationFn: () => generatePlayoff(tournamentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playoff', tournamentId] })
      queryClient.invalidateQueries({ queryKey: ['tournament-detail', slug] })
      toast.success('Bracket playoff berhasil dibuat!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal membuat bracket playoff')
    },
  })
}

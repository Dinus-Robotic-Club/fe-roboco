import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateSetting } from '@/lib/api/tour'

export interface IUpdateSettingInput {
  groupBestOf?: number
  upperBestOf?: number
  lowerBestOf?: number
  grandFinalBestOf?: number
  roundDurationSoccer?: number
  roundDurationSumo?: number
}

export const useUpdateSettings = (tournamentId: string, tournamentSlug: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IUpdateSettingInput) => {
      return updateSetting(tournamentId, JSON.stringify(data))
    },
    onSuccess: () => {
      toast.success('Pengaturan turnamen berhasil diperbarui')
      queryClient.invalidateQueries({ queryKey: ['detail-tournament', tournamentSlug] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui pengaturan turnamen')
    },
  })
}

export default useUpdateSettings

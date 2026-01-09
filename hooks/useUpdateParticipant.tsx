import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UpdateParticipantInput {
  participantId: string
  name?: string
  roleInTeam?: string
  image?: File | null
  identityCardImage?: File | null
}

export const useUpdateParticipant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ participantId, name, roleInTeam, image, identityCardImage }: UpdateParticipantInput) => {
      const formData = new FormData()

      if (name) formData.append('name', name)
      if (roleInTeam) formData.append('roleInTeam', roleInTeam)
      if (image) formData.append('participant-image', image)
      if (identityCardImage) formData.append('participant-id-card', identityCardImage)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/update/participant/${participantId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Gagal memperbarui profil peserta')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Profil peserta berhasil diperbarui')
      queryClient.invalidateQueries({ queryKey: ['team-profile'] })
      queryClient.invalidateQueries({ queryKey: ['team-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['participant'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui profil peserta')
    },
  })
}

export default useUpdateParticipant

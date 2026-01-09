import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth-context'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const useUpdateParticipantCertificate = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ participantId, file }: { participantId: string; file: File }) => {
      const formData = new FormData()
      formData.append('certificate', file)

      const res = await fetch(`${API_URL}/api/teams/participant/${participantId}/certificate`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.message || 'Failed to upload certificate')
      }

      return res.json()
    },
    onSuccess: () => {
      toast.success('Sertifikat berhasil diupload')
      queryClient.invalidateQueries({ queryKey: ['tournament'] })
    },
    onError: (error: Error) => {
      toast.error(`Gagal upload sertifikat: ${error.message}`)
    },
  })
}

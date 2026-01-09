import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UpdateTeamInput {
  teamId: string
  name?: string
  logo?: File | null
  password?: string
}

export const useUpdateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ teamId, name, logo, password }: UpdateTeamInput) => {
      const formData = new FormData()

      if (name) formData.append('name', name)
      if (password) formData.append('password', password)
      if (logo) formData.append('logo', logo)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/update/${teamId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Gagal memperbarui profil tim')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Profil tim berhasil diperbarui')
      queryClient.invalidateQueries({ queryKey: ['team-profile'] })
      queryClient.invalidateQueries({ queryKey: ['team-dashboard'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui profil tim')
    },
  })
}

export default useUpdateTeam

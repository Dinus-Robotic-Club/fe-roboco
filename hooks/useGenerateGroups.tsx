import { createGroup } from '@/lib/api/group'
import { createMatch } from '@/lib/api/match'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGenerateGroups = (tourId: string, slug: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['generate-groups'],
    mutationFn: () => createGroup(tourId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tournament-detail', slug] })
      toast.success('Groups generated! Creating matches...')

      try {
        await createMatch(tourId)
        toast.success('Matches created successfully!')
        queryClient.invalidateQueries({ queryKey: ['tournament-detail', slug] })
      } catch (error) {
        toast.error('Groups created, but failed to create matches.')
        console.log('Error creating matches after group generation:', error)
      }
    },
    onError: () => {
      toast.error('Failed to generate groups.')
    },
  })
}

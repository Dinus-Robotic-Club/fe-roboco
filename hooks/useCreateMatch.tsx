import { createMatch } from '@/lib/api/match'
import { QueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateMatch = (tourId: string, slug: string) => {
  const queryClient = new QueryClient()
  return useMutation({
    mutationKey: ['create-match'],
    mutationFn: () => createMatch(tourId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament-detail', slug] })
      toast.success('Match created successfully!')
    },
    onError: () => {
      toast.error('Failed to create match. Please try again.')
    },
  })
}

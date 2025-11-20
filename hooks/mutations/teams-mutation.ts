import { createTeams } from '@/lib/api/teams'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateTeam = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: FormData) => createTeams(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] })
        },
        onError: (err) => {
            console.error('Error create teams', err.message)
        },
    })
}

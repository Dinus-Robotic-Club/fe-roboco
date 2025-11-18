import { createTournament } from '@/lib/api/tournament'
import { IBodyCreateTournament } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateTournament = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: IBodyCreateTournament) => createTournament(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] })
        },
        onError: (err) => {
            console.error('Error create tournament', err)
        },
    })
}

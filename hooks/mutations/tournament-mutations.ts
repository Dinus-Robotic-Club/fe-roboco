import { createTournament } from '@/lib/api/tournament'
import { IApiResponse } from '@/lib/types/type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateTournament = () => {
    const queryClient = useQueryClient()

    return useMutation<IApiResponse<unknown>, Error, FormData>({
        mutationFn: (data: FormData) => createTournament(data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] })
            toast.success(res.message)
        },
        onError: (err) => {
            console.error('Error create tournament', err)
            toast.error(err.message)
        },
    })
}

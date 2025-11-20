import { createTeams } from '@/lib/api/teams'
import { IApiResponse } from '@/lib/types/type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateTeam = () => {
    const queryClient = useQueryClient()

    return useMutation<IApiResponse<unknown>, Error, FormData>({
        mutationFn: (data: FormData) => createTeams(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['teams'] })
            toast.success(data.message)
        },
        onError: (err) => {
            console.error('Error create teams', err.message)
            toast.error(err.message)
        },
    })
}

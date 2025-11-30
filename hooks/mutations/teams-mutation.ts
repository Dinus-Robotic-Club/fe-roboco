import { createTeams, updateAttendeance, updateStatusRegistration, updateTeamProfile } from '@/lib/api/teams'
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
            console.log('Error create teams', err.message)
            toast.error(err.message)
        },
    })
}

export const useUpdateTeam = () => {
    const queryClient = useQueryClient()

    return useMutation<IApiResponse<unknown>, Error, FormData>({
        mutationFn: (data: FormData) => updateTeamProfile(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['team'] })
            toast.success(data.message)
        },
        onError: (err) => {
            console.log('Error update team', err.message)
            toast.error(err.message)
        },
    })
}

export const useUpdateStatus = () => {
    const queryClient = useQueryClient()

    return useMutation<IApiResponse<unknown>, Error, { status: string; uid: string }>({
        mutationFn: ({ status, uid }) => updateStatusRegistration(status, uid),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] })
            toast.success(data.message)
        },
        onError: (err) => {
            console.log('Error update team', err.message)
            toast.error(err.message)
        },
    })
}

export const useAttendance = () => {
    const queryClient = useQueryClient()

    return useMutation<IApiResponse<unknown>, Error, { token: string }>({
        mutationFn: ({ token }) => updateAttendeance(token),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] })
            toast.success(data.message)
        },
        onError: (err) => {
            console.log('Error update attendance', err.message)
            toast.error(err.message)
        },
    })
}

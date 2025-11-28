import { getAllCommunity, getTeamDashboard, getTeamProfile } from '@/lib/api/teams'
import { useQuery } from '@tanstack/react-query'

export const useTeamDashboard = () => {
    return useQuery({
        queryKey: ['dashboard-teams'],
        queryFn: getTeamDashboard,
    })
}

export const useTeamProfile = () => {
    return useQuery({
        queryKey: ['profile-teams'],
        queryFn: getTeamProfile,
    })
}

export const useGetCommunity = () => {
    return useQuery({
        queryKey: ['all-community'],
        queryFn: getAllCommunity,
    })
}

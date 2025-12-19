import { getAllCommunity, getAllCommunityByRank, getTeamDashboard, getTeamProfile } from '@/lib/api/teams'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'

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
  return useSuspenseQuery({
    queryKey: ['all-community'],
    queryFn: getAllCommunity,
  })
}

export const useGetCommunityByRank = () => {
  return useSuspenseQuery({
    queryKey: ['all-community-rank'],
    queryFn: getAllCommunityByRank,
  })
}

import { getTeamProfile } from '@/lib/api/team'
import { useQuery } from '@tanstack/react-query'

export const useTeamProfile = () => {
  return useQuery({
    queryKey: ['profile-teams'],
    queryFn: getTeamProfile,
    enabled: true,
  })
}

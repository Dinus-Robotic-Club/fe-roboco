import { getTeamProfile } from "@/lib/api/team"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useTeamProfile = () => {
  return useSuspenseQuery({
    queryKey: ['profile-teams'],
    queryFn: getTeamProfile,
  })
}

import { getAllCommunityByRank } from "@/lib/api/team"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useGetCommunityByRank = () => {
  return useSuspenseQuery({
    queryKey: ['all-community-rank'],
    queryFn: getAllCommunityByRank,
  })
}

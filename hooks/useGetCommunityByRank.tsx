import { getAllCommunityByRank } from '@/lib/api/team'
import { useQuery } from '@tanstack/react-query'

export const useGetCommunityByRank = () => {
  return useQuery({
    queryKey: ['all-community-rank'],
    queryFn: getAllCommunityByRank,
    enabled: true,
  })
}

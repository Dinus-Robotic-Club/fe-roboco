import { getAllCommunity } from '@/lib/api/team'
import { useQuery } from '@tanstack/react-query'

export const useGetCommunity = () => {
  return useQuery({
    queryKey: ['all-community'],
    queryFn: getAllCommunity,
    enabled: true,
  })
}

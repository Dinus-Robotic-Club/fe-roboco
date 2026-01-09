import { getAllCommunity } from '@/lib/api/team'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useGetCommunity = () => {
  return useSuspenseQuery({
    queryKey: ['all-community'],
    queryFn: getAllCommunity,
  })
}

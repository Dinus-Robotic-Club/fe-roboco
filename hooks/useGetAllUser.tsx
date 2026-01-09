import { getAllUser } from '@/lib/api/user'
import { useQuery } from '@tanstack/react-query'

export const useGetAllUser = () => {
  return useQuery({
    queryKey: ['all-user'],
    queryFn: () => getAllUser(),
    enabled: true,
  })
}

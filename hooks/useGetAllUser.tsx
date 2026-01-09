import { getAllUser } from '@/lib/api/user'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useGetAllUser = () => {
  return useSuspenseQuery({
    queryKey: ['all-user'],
    queryFn: () => getAllUser(),
  })
}

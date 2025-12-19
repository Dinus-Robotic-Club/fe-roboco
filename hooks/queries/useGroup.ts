import { getAllGroup } from '@/lib/api/group'
import { useSuspenseQuery } from '@tanstack/react-query'

const useGetAllGroup = (tur: string) => {
  return useSuspenseQuery({
    queryKey: ['get-all-group', tur],
    queryFn: () => getAllGroup(tur),
  })
}

export { useGetAllGroup }

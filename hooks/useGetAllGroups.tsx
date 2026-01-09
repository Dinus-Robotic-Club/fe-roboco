import { getAllGroup } from '@/lib/api/group'
import { useSuspenseQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

export const useGetAllGroup = (tur: string) => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useSuspenseQuery({
    queryKey: ['get-all-group', tur, token],
    queryFn: () => getAllGroup(tur, token || undefined),
  })
}

import { getAllMatchHistoryById } from '@/lib/api/match'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useGetHistoryMatchById = () => {
  return useSuspenseQuery({
    queryKey: ['history-match-id'],
    queryFn: getAllMatchHistoryById,
  })
}

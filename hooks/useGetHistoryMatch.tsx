import { getAllMatchHistory } from "@/lib/api/match"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useGetHistoryMatch = () => {
  return useSuspenseQuery({
    queryKey: ['all-history-match'],
    queryFn: getAllMatchHistory,
  })
}

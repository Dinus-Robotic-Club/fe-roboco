import { getAllMatchOnGoingById } from "@/lib/api/match"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useGetOnGoingMatchById = () => {
  return useSuspenseQuery({
    queryKey: ['ongoing-match-id'],
    queryFn: getAllMatchOnGoingById,
  })
}

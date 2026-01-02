import { getAllMatchOnGoing } from "@/lib/api/match"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useGetOnGoingMatch = () => {
  return useSuspenseQuery({
    queryKey: ['all-ongoing-match'],
    queryFn: getAllMatchOnGoing,
  })
}

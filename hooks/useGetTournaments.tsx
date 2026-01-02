import { getAllTournaments } from "@/lib/api/tour"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useGetTournaments = () => {
  return useSuspenseQuery({
    queryKey: ['tournaments'],
    queryFn: getAllTournaments,
  })
}

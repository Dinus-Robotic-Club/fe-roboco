'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { getAllTournaments, getDetailTournament } from '@/lib/api/tournament'
import { TournamentApiResponse } from '@/lib/types/tournament'

export const useTournaments = () => {
  return useSuspenseQuery({
    queryKey: ['tournaments'],
    queryFn: getAllTournaments,
  })
}

export const useDetailTournaments = (slug: string) => {
  return useSuspenseQuery<TournamentApiResponse, Error>({
    queryKey: ['tournaments', slug],
    queryFn: () => getDetailTournament(slug),
  })
}

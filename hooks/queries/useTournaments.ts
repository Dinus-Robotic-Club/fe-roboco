'use client'

import { useQuery } from '@tanstack/react-query'
import { getAllTournaments, getDetailTournament } from '@/lib/api/tournament'
import { TournamentApiResponse } from '@/lib/types/tournament'

export const useTournaments = () => {
    return useQuery({
        queryKey: ['tournaments'],
        queryFn: getAllTournaments,
    })
}

export const useDetailTournaments = (slug: string) => {
    return useQuery<TournamentApiResponse, Error>({
        queryKey: ['tournaments', slug],

        queryFn: () => getDetailTournament(slug),

        enabled: !!slug,
    })
}

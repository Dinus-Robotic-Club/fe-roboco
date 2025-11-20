'use client'

import { useQuery } from '@tanstack/react-query'
import { getAllTournaments } from '@/lib/api/tournament'

export const useTournaments = () => {
    return useQuery({
        queryKey: ['tournaments'],
        queryFn: getAllTournaments,
    })
}

import { getAllMatchHistory, getAllMatchHistoryById, getAllMatchOnGoing, getAllMatchOnGoingById } from '@/lib/api/match'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useGetOnGoingMatch = () => {
    return useSuspenseQuery({
        queryKey: ['all-ongoing-match'],
        queryFn: getAllMatchOnGoing,
    })
}

export const useGetHistoryMatch = () => {
    return useSuspenseQuery({
        queryKey: ['all-history-match'],
        queryFn: getAllMatchHistory,
    })
}
export const useGetOnGoingMatchById = () => {
    return useSuspenseQuery({
        queryKey: ['ongoing-match-id'],
        queryFn: getAllMatchOnGoingById,
    })
}
export const useGetHistoryMatchById = () => {
    return useSuspenseQuery({
        queryKey: ['history-match-id'],
        queryFn: getAllMatchHistoryById,
    })
}

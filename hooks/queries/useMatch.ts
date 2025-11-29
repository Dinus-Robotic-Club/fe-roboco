import { getAllMatchHistory, getAllMatchHistoryById, getAllMatchOnGoing, getAllMatchOnGoingById } from '@/lib/api/match'
import { useQuery } from '@tanstack/react-query'

export const useGetOnGoingMatch = () => {
    return useQuery({
        queryKey: ['all-ongoing-match'],
        queryFn: getAllMatchOnGoing,
    })
}

export const useGetHistoryMatch = () => {
    return useQuery({
        queryKey: ['all-history-match'],
        queryFn: getAllMatchHistory,
    })
}
export const useGetOnGoingMatchById = () => {
    return useQuery({
        queryKey: ['ongoing-match-id'],
        queryFn: getAllMatchOnGoingById,
    })
}
export const useGetHistoryMatchById = () => {
    return useQuery({
        queryKey: ['history-match-id'],
        queryFn: getAllMatchHistoryById,
    })
}

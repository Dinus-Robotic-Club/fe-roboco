import { useGetHistoryMatch, useGetHistoryMatchById, useGetOnGoingMatch, useGetOnGoingMatchById } from '../queries/useMatch'

export function useMatchPage() {
    const onGoing = useGetOnGoingMatchById()
    const history = useGetHistoryMatchById()

    return {
        onGoing: onGoing.data,
        history: history.data,

        isLoading: onGoing.isLoading || history.isLoading,
    }
}

export function useAllMatchPage() {
    const onGoing = useGetOnGoingMatch()
    const history = useGetHistoryMatch()

    return {
        onGoing: onGoing.data,
        history: history.data,

        isLoading: onGoing.isLoading || history.isLoading,
    }
}

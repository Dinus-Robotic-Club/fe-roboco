import { useGetHistoryMatch, useGetHistoryMatchById, useGetOnGoingMatch, useGetOnGoingMatchById } from '../queries/useMatch'

export function useMatchPage() {
    const onGoing = useGetOnGoingMatchById()
    const history = useGetHistoryMatchById()

    return {
        onGoing: onGoing.data,
        history: history.data,
    }
}

export function useAllMatchPage() {
    const onGoing = useGetOnGoingMatch()
    const history = useGetHistoryMatch()

    return {
        onGoing: onGoing.data,
        history: history.data,
    }
}

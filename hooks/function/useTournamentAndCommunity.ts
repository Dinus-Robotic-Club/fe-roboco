import { useGetCommunity } from '../queries/useTeams'
import { useTournaments } from '../queries/useTournaments'

export function useTournamentAndCommunity() {
    const tournaments = useTournaments()
    const communities = useGetCommunity()

    return {
        tournaments: tournaments.data,
        communities: communities.data,

        isLoading: tournaments.isLoading || communities.isLoading,
        isError: tournaments.isError || communities.isError,
    }
}

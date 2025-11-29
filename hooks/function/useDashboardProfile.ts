import { useTeamDashboard, useTeamProfile } from '../queries/useTeams'

export function useDashboardProfile() {
    const dashboard = useTeamDashboard()
    const profile = useTeamProfile()

    return {
        dashboard: dashboard.data,
        profile: profile.data,

        isLoading: dashboard.isLoading || profile.isLoading,
    }
}

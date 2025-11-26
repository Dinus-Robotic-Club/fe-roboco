import { DashboardTeamData } from '../types/team'
import { IApiResponse, IGetAllCommunity } from '../types/type'
import { apiFetch } from './client'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const createTeams = (data: FormData): Promise<IApiResponse<unknown>> => {
    return apiFetch<IApiResponse<unknown>>(`${BASE}/api/teams/registration`, {
        method: 'POST',
        body: data,
    })
}

export const getTeamDashboard = (): Promise<IApiResponse<DashboardTeamData>> => {
    return apiFetch<IApiResponse<DashboardTeamData>>(`${BASE}/api/teams/dashboard`, {
        method: 'GET',
    })
}

export const getTeamProfile = (): Promise<IApiResponse<unknown>> => {
    return apiFetch<IApiResponse<unknown>>(`${BASE}/api/teams/profile`, {
        method: 'GET',
    })
}

export const getAllCommunity = (): Promise<IApiResponse<IGetAllCommunity[]>> => {
    return apiFetch<IApiResponse<IGetAllCommunity[]>>(`${BASE}/api/teams/community`)
}

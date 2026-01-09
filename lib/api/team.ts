import { apiFetch } from '../config/api.config'
import { IApiResponse } from '../types'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const createTeams = (data: FormData): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/teams/registration`, {
    method: 'POST',
    body: data,
  })
}

export const createTeamsByAdmin = (data: FormData): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/teams/create-by-admin`, {
    method: 'POST',
    body: data,
  })
}

export const getAllTeam = (): Promise<IApiResponse<ITeam[]>> => {
  return apiFetch<IApiResponse<ITeam[]>>(`${BASE}/api/teams/get-all`, {
    method: 'GET',
  })
}

export const getTeamDashboard = (): Promise<IApiResponse<DashboardTeamData>> => {
  return apiFetch<IApiResponse<DashboardTeamData>>(`${BASE}/api/teams/dashboard`, {
    method: 'GET',
  })
}

export const getTeamProfile = (): Promise<IApiResponse<ITeamDetail>> => {
  return apiFetch<IApiResponse<ITeamDetail>>(`${BASE}/api/teams/profile`, {
    method: 'GET',
  })
}

export const updateTeamProfile = (data: FormData): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/teams/update`, {
    method: 'PUT',
    body: data,
  })
}

export const updateParticipant = (uid: string, data: FormData): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/teams/update/participant/${uid}`, {
    method: 'PUT',
    body: data,
  })
}

export const getAllCommunity = (): Promise<IApiResponse<IGetAllCommunity[]>> => {
  return apiFetch<IApiResponse<IGetAllCommunity[]>>(`${BASE}/api/teams/community`)
}

export const getAllCommunityByRank = (): Promise<IApiResponse<ICommunityResponse>> => {
  return apiFetch<IApiResponse<ICommunityResponse>>(`${BASE}/api/teams/community/rank`)
}

export const updateStatusRegistration = (status: string, uid: string): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/teams/update/${uid}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status: status }),
  })
}

export const updateAttendeance = (token: string): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/teams/attendeance`, {
    method: 'POST',
    body: JSON.stringify({ token: token }),
  })
}

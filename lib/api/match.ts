import { apiFetch } from '../config/api.config'
import { IApiResponse } from '../types'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const getAllMatchOnGoing = (): Promise<IApiResponse<MatchListResponse>> => {
  return apiFetch<IApiResponse<MatchListResponse>>(`${BASE}/api/matches/ongoing`, {
    method: 'GET',
  })
}

export const getAllMatchHistory = (): Promise<IApiResponse<MatchListResponse>> => {
  return apiFetch<IApiResponse<MatchListResponse>>(`${BASE}/api/matches/history`, {
    method: 'GET',
  })
}

export const getAllMatchOnGoingById = (): Promise<IApiResponse<MatchListResponse>> => {
  return apiFetch<IApiResponse<MatchListResponse>>(`${BASE}/api/matches/team/ongoing`, {
    method: 'GET',
  })
}

export const getAllMatchHistoryById = (): Promise<IApiResponse<MatchListResponse>> => {
  return apiFetch<IApiResponse<MatchListResponse>>(`${BASE}/api/matches/team/history`, {
    method: 'GET',
  })
}

export const createMatchRound = (tourId: string, matchId: string): Promise<IApiResponse<IRound>> => {
  return apiFetch<IApiResponse<IRound>>(`${BASE}/api/matches/round/${tourId}/create/${matchId}`, {
    method: 'POST',
  })
}

export const getMatchRound = (matchId: string): Promise<IApiResponse<IMatchRound>> => {
  return apiFetch<IApiResponse<IMatchRound>>(`${BASE}/api/matches/round/${matchId}`, {
    method: 'GET',
  })
}

export const createMatch = (tourId: string): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/matches/create/${tourId}`, {
    method: 'POST',
  })
}

export const updateScore = (matchId: string, body: IScoreUpdateBody): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/matches/score/update/${matchId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export const endMatchRound = (matchId: string): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/matches/finish-round/${matchId}`, {
    method: 'POST',
  })
}

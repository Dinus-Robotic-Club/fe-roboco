import { apiFetch } from '../config/api.config'
import { IApiResponse } from '../types'

const BASE = process.env.NEXT_PUBLIC_API_URL

export interface PlayoffBracket {
  uid: string
  tournamentId: string
  type: 'UPPER' | 'LOWER' | 'GRAND_FINAL'
  round: number
  name: string | null
  category: 'SOCCER' | 'SUMO' | null
  matchIndex: number | null
  matches: PlayoffMatch[]
}

export interface PlayoffMatch {
  uid: string
  tournamentId: string
  bracketId: string | null
  teamAId: string | null
  teamBId: string | null
  bestOf: number
  scoreA: number
  scoreB: number
  nextMatchWinId: string | null
  nextMatchLoseId: string | null
  nextMatchWinSlotIsB: boolean | null
  nextMatchLoseSlotIsB: boolean | null
  winnerId: string | null
  status: 'PENDING' | 'SCHEDULED' | 'ONGOING' | 'FINISHED' | 'CANCELLED'
  roundLabel: string | null
  category: 'SOCCER' | 'SUMO' | null
  teamA: {
    uid: string
    name: string
    logo: string | null
    community: { name: string } | null
  } | null
  teamB: {
    uid: string
    name: string
    logo: string | null
    community: { name: string } | null
  } | null
  winner: {
    uid: string
    name: string
  } | null
}

export interface IPlayoffResponse {
  soccer: PlayoffBracket[]
  sumo: PlayoffBracket[]
  total: number
}

// Get playoff data
export const getPlayoff = (tournamentId: string, token?: string): Promise<IApiResponse<IPlayoffResponse>> => {
  return apiFetch<IApiResponse<IPlayoffResponse>>(`${BASE}/api/playoff/${tournamentId}`, {
    method: 'GET',
    token,
  })
}

// Generate playoff bracket
export const generatePlayoff = (tournamentId: string): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/playoff/generate/${tournamentId}`, {
    method: 'POST',
  })
}

// Transform backend response to IMatchBracket[] format for BracketDouble component
export const transformPlayoffToMatchBracket = (brackets: PlayoffBracket[]): IMatchBracket[] => {
  const matches: IMatchBracket[] = []

  // Sort brackets by round
  const sortedBrackets = [...brackets].sort((a, b) => a.round - b.round)

  sortedBrackets.forEach((bracket) => {
    bracket.matches.forEach((match, matchIdx) => {
      // Generate ID based on bracket type and position
      let matchId = ''
      if (bracket.type === 'UPPER') {
        // UB-R1-M1, UB-R1-M2, etc.
        matchId = `UB-R${bracket.round}-M${matchIdx + 1}`
      } else if (bracket.type === 'LOWER') {
        matchId = `LB-R${bracket.round}-M${matchIdx + 1}`
      } else if (bracket.type === 'GRAND_FINAL') {
        matchId = `GRAND-FINAL`
      }

      // Map status
      let status: 'Scheduled' | 'Live' | 'Completed' = 'Scheduled'
      if (match.status === 'FINISHED') status = 'Completed'
      else if (match.status === 'ONGOING') status = 'Live'

      // Create team objects
      const teamA: ITeamBracket | null = match.teamA
        ? {
            id: match.teamA.uid,
            name: match.teamA.name,
            logoUrl: match.teamA.logo ?? undefined,
            isWinner: match.winnerId === match.teamA.uid,
          }
        : null

      const teamB: ITeamBracket | null = match.teamB
        ? {
            id: match.teamB.uid,
            name: match.teamB.name,
            logoUrl: match.teamB.logo ?? undefined,
            isWinner: match.winnerId === match.teamB.uid,
          }
        : null

      // Find next match ID in our transformed format
      let nextMatchWinId: string | null = null
      if (match.nextMatchWinId) {
        // Find the bracket/match that has this uid
        for (const b of sortedBrackets) {
          const foundMatch = b.matches.find((m) => m.uid === match.nextMatchWinId)
          if (foundMatch) {
            const foundMatchIdx = b.matches.indexOf(foundMatch)
            if (b.type === 'UPPER') {
              nextMatchWinId = `UB-R${b.round}-M${foundMatchIdx + 1}`
            } else if (b.type === 'LOWER') {
              nextMatchWinId = `LB-R${b.round}-M${foundMatchIdx + 1}`
            } else {
              nextMatchWinId = `GRAND-FINAL`
            }
            break
          }
        }
      }

      matches.push({
        id: matchId,
        matchUid: match.uid, // Backend match uid for socket updates
        name: match.roundLabel ?? matchId,
        teams: [teamA, teamB],
        status,
        score: [match.scoreA, match.scoreB],
        category: match.category,
        nextMatchWinId,
        nextMatchLoseId: null, // For single elim, no loser bracket connection
        nextMatchWinSlotIsB: match.nextMatchWinSlotIsB,
        nextMatchLoseSlotIsB: null,
      })
    })
  })

  return matches
}

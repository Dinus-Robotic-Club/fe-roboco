'use client'

import { useEffect, useRef, useCallback, useState, useMemo } from 'react'
import { io, Socket } from 'socket.io-client'
import { transformPlayoffToMatchBracket, PlayoffBracket, PlayoffMatch } from '@/lib/api/playoff'
import { IPlayoffResponse } from '@/lib/api/playoff'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

interface LeagueboardState {
  onGoingMatches: ICardMatch[]
  historyMatches: ICardMatch[]
  communityRank: { total: number; communities: ICommunity[] } | null
  groups: IGroupData[]
  // Store raw bracket data for updates
  rawSoccerBrackets: PlayoffBracket[]
  rawSumoBrackets: PlayoffBracket[]
}

interface IScoreUpdatePayload {
  matchId: string
  roundId: string
  newScore: {
    teamA: number
    teamB: number
  }
  cumulativeMatchScore?: {
    scoreA: number
    scoreB: number
  }
  status: {
    matchFinished: boolean
    roundFinished: boolean
    winnerId: string | null
  }
}

interface IRegistrationUpdatePayload {
  teamId: string
  teamName: string
  status: 'APPROVED' | 'REJECTED' | 'PENDING'
  updatedAt: string
}

interface IAttendanceUpdatePayload {
  teamId: string
  teamName: string
  isPresent: boolean
  scannedAt: string
}

// Helper: Update a match in raw bracket data
const updateRawBracketMatch = (brackets: PlayoffBracket[], matchUid: string, updates: Partial<PlayoffMatch>): PlayoffBracket[] => {
  return brackets.map((bracket) => ({
    ...bracket,
    matches: bracket.matches.map((match) => {
      if (match.uid === matchUid) {
        return { ...match, ...updates }
      }
      return match
    }),
  }))
}

// Helper: Find and update match by uid across all brackets
const findAndUpdateMatch = (
  brackets: PlayoffBracket[],
  matchUid: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any,
): PlayoffBracket[] => {
  return brackets.map((bracket) => ({
    ...bracket,
    matches: bracket.matches.map((match) => {
      if (match.uid === matchUid) {
        return {
          ...match,
          scoreA: matchData.scoreA ?? match.scoreA,
          scoreB: matchData.scoreB ?? match.scoreB,
          status: matchData.status ?? match.status,
          winnerId: matchData.winnerId ?? match.winnerId,
          teamA: matchData.teamA
            ? {
                uid: matchData.teamA.uid,
                name: matchData.teamA.name,
                logo: matchData.teamA.logo,
                community: matchData.teamA.community,
              }
            : match.teamA,
          teamB: matchData.teamB
            ? {
                uid: matchData.teamB.uid,
                name: matchData.teamB.name,
                logo: matchData.teamB.logo,
                community: matchData.teamB.community,
              }
            : match.teamB,
        }
      }
      return match
    }),
  }))
}

export function useLeagueboardSocket(tournamentId?: string) {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // State for all leagueboard data
  const [state, setState] = useState<LeagueboardState>({
    onGoingMatches: [],
    historyMatches: [],
    communityRank: null,
    groups: [],
    rawSoccerBrackets: [],
    rawSumoBrackets: [],
  })

  // Compute transformed brackets from raw data
  const soccerBracket = useMemo(() => (state.rawSoccerBrackets.length > 0 ? transformPlayoffToMatchBracket(state.rawSoccerBrackets) : []), [state.rawSoccerBrackets])

  const sumoBracket = useMemo(() => (state.rawSumoBrackets.length > 0 ? transformPlayoffToMatchBracket(state.rawSumoBrackets) : []), [state.rawSumoBrackets])

  // Only run on client after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // Connect to socket server
    socketRef.current = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      // console.log('[LeagueboardSocket] Connected:', socket.id)
      setIsConnected(true)

      // Join tournament room if tournamentId provided
      if (tournamentId) {
        socket.emit('join-tournament', tournamentId)
        // console.log('[LeagueboardSocket] Joined tournament:', tournamentId)
      }
    })

    socket.on('disconnect', () => {
      // console.log('[LeagueboardSocket] Disconnected')
      setIsConnected(false)
    })

    // ==========================================
    // GROUPS EVENTS
    // ==========================================
    socket.on('groups:generate', (data: IGroupData[]) => {
      // console.log('[LeagueboardSocket] Groups generated:', data)
      setState((prev) => ({ ...prev, groups: data }))
    })

    socket.on('groups:update', (data: IGroupData[]) => {
      // console.log('[LeagueboardSocket] Groups updated:', data)
      setState((prev) => ({ ...prev, groups: data }))
    })

    socket.on('community:rank-update', (data: any) => {
      // console.log('[LeagueboardSocket] Community Rank updated:', data)
      setState((prev) => ({ ...prev, communityRank: data }))
    })

    // ==========================================
    // MATCH EVENTS
    // ==========================================

    // New matches created
    socket.on('match-group:create', (data: ICardMatch | ICardMatch[]) => {
      // console.log('[LeagueboardSocket] Match group created:', data)
      const newMatches = Array.isArray(data) ? data : [data]
      setState((prev) => ({
        ...prev,
        onGoingMatches: [...newMatches, ...prev.onGoingMatches],
      }))
    })

    // Match round created (match started) - update status
    socket.on('match-round:create', (data: { matchId: string }) => {
      // console.log('[LeagueboardSocket] Match round created:', data)
      setState((prev) => ({
        ...prev,
        onGoingMatches: prev.onGoingMatches.map((m) => (m.uid === data.matchId ? { ...m, status: 'ONGOING' as const } : m)),
        rawSoccerBrackets: updateRawBracketMatch(prev.rawSoccerBrackets, data.matchId, { status: 'ONGOING' }),
        rawSumoBrackets: updateRawBracketMatch(prev.rawSumoBrackets, data.matchId, { status: 'ONGOING' }),
      }))
    })

    // ==========================================
    // SCORE UPDATE - Handles SUMO round wins and match status
    // SOCCER scores are handled by event:create (goal events)
    // ==========================================
    socket.on('score:update', (data: IScoreUpdatePayload) => {
      // console.log('[LeagueboardSocket] Score update:', data)
      const { matchId, roundId, newScore, cumulativeMatchScore, status } = data

      setState((prev) => {
        const currentOnGoing = prev.onGoingMatches.find((m) => m.uid === matchId)
        const isSumo = currentOnGoing?.category === 'SUMO'

        // Get current scores
        const currentScoreA = currentOnGoing?.scoreA || 0
        const currentScoreB = currentOnGoing?.scoreB || 0

        // Calculate new match scores
        // Prefer server-provided cumulative scores for accuracy
        let newMatchScoreA = currentScoreA
        let newMatchScoreB = currentScoreB

        if (isSumo && status.roundFinished) {
          if (cumulativeMatchScore) {
            // Use server-provided cumulative scores (more accurate across rounds)
            newMatchScoreA = cumulativeMatchScore.scoreA
            newMatchScoreB = cumulativeMatchScore.scoreB
          } else {
            // Fallback: accumulate rounds won locally
            if (newScore.teamA > newScore.teamB) {
              newMatchScoreA = currentScoreA + 1
            } else if (newScore.teamB > newScore.teamA) {
              newMatchScoreB = currentScoreB + 1
            }
          }
        }
        // SOCCER: scores are updated via event:create, not here

        // Update ongoing matches
        let updatedOnGoing = prev.onGoingMatches.map((m) => {
          if (m.uid === matchId) {
            return {
              ...m,
              scoreA: newMatchScoreA,
              scoreB: newMatchScoreB,
              status: (status.matchFinished ? 'FINISHED' : m.status) as typeof m.status,
              winnerId: status.winnerId || m.winnerId,
              // Track round scores for reference
              rounds: m.rounds?.map((r) => {
                if (r.uid === roundId) {
                  return { ...r, scoreA: newScore.teamA, scoreB: newScore.teamB, status: status.roundFinished ? 'FINISHED' : r.status }
                }
                return r
              }),
            }
          }
          return m
        })

        // Move finished match to history
        let updatedHistory = prev.historyMatches
        if (status.matchFinished) {
          const finishedMatch = updatedOnGoing.find((m) => m.uid === matchId)
          if (finishedMatch) {
            updatedHistory = [{ ...finishedMatch, status: 'FINISHED' as const, winnerId: status.winnerId }, ...prev.historyMatches]
            updatedOnGoing = updatedOnGoing.filter((m) => m.uid !== matchId)
          }
        }

        // Update brackets for SUMO
        const bracketUpdate = {
          scoreA: newMatchScoreA,
          scoreB: newMatchScoreB,
          status: status.matchFinished ? ('FINISHED' as const) : ('ONGOING' as const),
          winnerId: status.winnerId,
        }

        return {
          ...prev,
          onGoingMatches: updatedOnGoing,
          historyMatches: updatedHistory,
          rawSumoBrackets: updateRawBracketMatch(prev.rawSumoBrackets, matchId, bracketUpdate),
          // Also update soccer brackets for status changes
          rawSoccerBrackets: status.matchFinished ? updateRawBracketMatch(prev.rawSoccerBrackets, matchId, { status: 'FINISHED', winnerId: status.winnerId }) : prev.rawSoccerBrackets,
        }
      })
    })

    // ==========================================
    // EVENT CREATE - Timeline updates + SOCCER score increment
    // ==========================================
    socket.on('event:create', (data: { matchId: string; event: IMatchEvent; cumulativeScores?: { scoreA: number; scoreB: number } }) => {
      // console.log('[LeagueboardSocket] Event created:', data)
      setState((prev) => {
        const currentMatch = prev.onGoingMatches.find((m) => m.uid === data.matchId)
        const isSoccer = currentMatch?.category === 'SOCCER'
        const isGoal = data.event.type === 'GOAL'

        // Use cumulative scores from backend if available (more accurate)
        // Otherwise fallback to local calculation
        let newScoreA = currentMatch?.scoreA || 0
        let newScoreB = currentMatch?.scoreB || 0

        if (isSoccer && isGoal) {
          if (data.cumulativeScores) {
            // Use server-provided cumulative scores for accuracy
            newScoreA = data.cumulativeScores.scoreA
            newScoreB = data.cumulativeScores.scoreB
          } else {
            // Fallback: Increment score based on which team scored
            if (data.event.teamId === currentMatch?.teamAId) {
              newScoreA += data.event.value || 1
            } else if (data.event.teamId === currentMatch?.teamBId) {
              newScoreB += data.event.value || 1
            }
          }
        }

        // Update ongoing matches
        const updatedOnGoing = prev.onGoingMatches.map((m) => {
          if (m.uid === data.matchId) {
            return {
              ...m,
              scoreA: isSoccer && isGoal ? newScoreA : m.scoreA,
              scoreB: isSoccer && isGoal ? newScoreB : m.scoreB,
              events: [...(m.events || []), data.event],
            }
          }
          return m
        })

        // Update brackets for SOCCER
        let updatedSoccerBrackets = prev.rawSoccerBrackets
        if (isSoccer && isGoal) {
          updatedSoccerBrackets = updateRawBracketMatch(prev.rawSoccerBrackets, data.matchId, {
            scoreA: newScoreA,
            scoreB: newScoreB,
          })
        }

        return {
          ...prev,
          onGoingMatches: updatedOnGoing,
          rawSoccerBrackets: updatedSoccerBrackets,
        }
      })
    })

    // ==========================================
    // MATCH UPDATE - Full match data (includes team advancement)
    // ==========================================
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on('match:update', (data: any) => {
      // console.log('[LeagueboardSocket] Match updated:', data)

      setState((prev) => {
        const existsInOngoing = prev.onGoingMatches.some((m) => m.uid === data.uid)
        const isFinished = data.status === 'FINISHED' || data.status === 'WALKOUT'
        const isOngoing = data.status === 'ONGOING'

        let updatedOnGoing = [...prev.onGoingMatches]
        let updatedHistory = [...prev.historyMatches]

        if (isFinished) {
          // Remove from ongoing if exists
          updatedOnGoing = updatedOnGoing.filter((m) => m.uid !== data.uid)
          // Add to history if not exists
          if (!prev.historyMatches.some((m) => m.uid === data.uid)) {
            updatedHistory = [data, ...updatedHistory]
          } else {
            updatedHistory = updatedHistory.map((m) => (m.uid === data.uid ? data : m))
          }
        } else if (isOngoing || existsInOngoing) {
          if (existsInOngoing) {
            updatedOnGoing = updatedOnGoing.map((m) => (m.uid === data.uid ? { ...m, ...data } : m))
          } else {
            updatedOnGoing = [data, ...updatedOnGoing]
          }
        }

        // CRITICAL: Update brackets with full match data (for team advancement to LB/next round)
        // This handles: winner advancing, loser going to LB
        const updatedSoccerBrackets = findAndUpdateMatch(prev.rawSoccerBrackets, data.uid, data)
        const updatedSumoBrackets = findAndUpdateMatch(prev.rawSumoBrackets, data.uid, data)

        return {
          ...prev,
          onGoingMatches: updatedOnGoing,
          historyMatches: updatedHistory,
          rawSoccerBrackets: updatedSoccerBrackets,
          rawSumoBrackets: updatedSumoBrackets,
        }
      })
    })

    // ==========================================
    // PLAYOFF EVENTS
    // ==========================================
    socket.on('playoff-generated', (data: IPlayoffResponse) => {
      // console.log('[LeagueboardSocket] Playoff generated:', data)
      setState((prev) => ({
        ...prev,
        rawSoccerBrackets: data.soccer || [],
        rawSumoBrackets: data.sumo || [],
      }))
    })

    // ==========================================
    // REGISTRATION & ATTENDANCE EVENTS
    // ==========================================
    socket.on('registration:update', (data: IRegistrationUpdatePayload) => {
      // console.log('[LeagueboardSocket] Registration update:', data)
      setState((prev) => ({
        ...prev,
        groups: prev.groups.map((group) => ({
          ...group,
          teams: group.teams.map((t) => (t.team.uid === data.teamId ? { ...t, team: { ...t.team, registrationStatus: data.status } } : t)),
        })),
      }))
    })

    socket.on('attendance:update', (data: IAttendanceUpdatePayload) => {
      // console.log('[LeagueboardSocket] Attendance update:', data)
      setState((prev) => ({
        ...prev,
        groups: prev.groups.map((group) => ({
          ...group,
          teams: group.teams.map((t) => (t.team.uid === data.teamId ? { ...t, team: { ...t.team, isPresent: data.isPresent } } : t)),
        })),
      }))
    })

    // ==========================================
    // COMMUNITY EVENTS
    // ==========================================
    socket.on('community:update', (data: { total: number; communities: ICommunity[] }) => {
      // console.log('[LeagueboardSocket] Community update:', data)
      setState((prev) => ({ ...prev, communityRank: data }))
    })

    return () => {
      if (tournamentId) {
        socket.emit('leave-tournament', tournamentId)
      }
      socket.disconnect()
    }
  }, [isMounted, tournamentId])

  // Initialize state with fetched data
  const initializeData = useCallback(
    (data: {
      onGoingMatches?: ICardMatch[]
      historyMatches?: ICardMatch[]
      communityRank?: { total: number; communities: ICommunity[] } | null
      groups?: IGroupData[]
      playoffData?: IPlayoffResponse | null
    }) => {
      setState((prev) => ({
        ...prev,
        onGoingMatches: data.onGoingMatches ?? prev.onGoingMatches,
        historyMatches: data.historyMatches ?? prev.historyMatches,
        communityRank: data.communityRank ?? prev.communityRank,
        groups: data.groups ?? prev.groups,
        rawSoccerBrackets: data.playoffData?.soccer ?? prev.rawSoccerBrackets,
        rawSumoBrackets: data.playoffData?.sumo ?? prev.rawSumoBrackets,
      }))
    },
    [],
  )

  const joinTournament = useCallback((tourId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join-tournament', tourId)
    }
  }, [])

  const leaveTournament = useCallback((tourId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave-tournament', tourId)
    }
  }, [])

  return {
    isConnected,
    joinTournament,
    leaveTournament,
    initializeData,
    // State
    onGoingMatches: state.onGoingMatches,
    historyMatches: state.historyMatches,
    communityRank: state.communityRank,
    groups: state.groups,
    soccerBracket,
    sumoBracket,
  }
}

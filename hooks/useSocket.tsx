'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'

// Re-enable types logic if needed, simplify imports for logging injection context
// Removed global type imports as they are available globally
import { IApiResponse } from '@/lib/types'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

interface IScoreUpdatePayload {
  matchId: string
  roundId: string
  newScore: {
    teamA: number
    teamB: number
  }
  status: {
    matchFinished: boolean
    roundFinished: boolean
    winnerId: string | null
  }
}

export function useSocket(tournamentId?: string) {
  const socketRef = useRef<Socket | null>(null)
  const queryClient = useQueryClient()
  const [isConnected, setIsConnected] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // [🪝 HOOK TRIGGER] Logger
  useEffect(() => {
    console.log('[🪝 HOOK TRIGGER] File:useSocket.tsx Hook:useSocket triggered by:', { tournamentId, isMounted })
  }, [tournamentId, isMounted])

  // Only run on client after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Don't connect until component is mounted on client
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
      console.log('[Socket] Connected:', socket.id)
      setIsConnected(true)

      // Join tournament room if tournamentId provided
      if (tournamentId) {
        socket.emit('join-tournament', tournamentId)
        console.log('[Socket] Joined tournament:', tournamentId)
      }
    })

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
      setIsConnected(false)
    })

    // Listen for match-group updates
    socket.on('match-group:create', (data: ICardMatch | ICardMatch[]) => {
      console.log('[Socket] Match group created:', data)
      // Update ongoing matches
      queryClient.setQueryData(['all-ongoing-match', null], (old: IApiResponse<ICardMatch[]> | undefined) => {
        if (!old || !old.data) return old
        // Avoid duplicates if data is array
        const newMatches = Array.isArray(data) ? data : [data]
        return {
          ...old,
          data: [...newMatches, ...old.data],
        }
      })
      // If we had a key for match group specific
      queryClient.invalidateQueries({ queryKey: ['match-group'] })
    })

    // Listen for groups generated
    socket.on('groups:generate', (data: IGroupData[]) => {
      console.log('[Socket] Groups generated:', data)
      queryClient.setQueryData(['get-all-group', tournamentId, null], (old: IApiResponse<IGroupData[]> | undefined) => {
        if (!old) return { data: data, success: true, status: 200, message: 'Socket Update' }
        return { ...old, data: data }
      })
      // Fallback invalidate
      queryClient.invalidateQueries({ queryKey: ['get-all-group', tournamentId] })
    })

    // Listen for playoff updates
    socket.on('playoff-generated', (data: unknown) => {
      console.log('[Socket] Playoff generated:', data)
      if (tournamentId) {
        queryClient.setQueryData(['get-playoff', tournamentId, null], () => {
          return { data: data, success: true, status: 200, message: 'Socket Update' }
        })
      }
      queryClient.invalidateQueries({ queryKey: ['get-playoff', tournamentId] })
    })

    // Listen for specific match round creation
    socket.on('match-round:create', (data: { matchId: string }) => {
      console.log('[Socket] Match round create:', data)
      const matchId = data.matchId
      if (matchId) {
        queryClient.invalidateQueries({ queryKey: ['match-round', matchId] })
      }
    })

    // Listen for score updates
    socket.on('score:update', (data: IScoreUpdatePayload) => {
      // data contains: matchId, roundId, newScore: {teamA, teamB}, status
      console.log('[Socket] Score update:', data)
      const { matchId, newScore, status } = data

      // Update match round detail if active
      if (matchId) {
        queryClient.setQueryData(['match-round', matchId, null], (old: IApiResponse<IMatchRound> | undefined) => {
          if (!old || !old.data) return old

          // Update rounds
          const updatedRounds = old.data.rounds?.map((r: IRound) => {
            if (r.uid === data.roundId) {
              return {
                ...r,
                scoreA: newScore.teamA,
                scoreB: newScore.teamB,
                status: status.roundFinished ? 'FINISHED' : r.status,
                winnerId: status.winnerId || r.winnerId,
              }
            }
            return r
          })

          // Update match status if finished
          const updatedMatch: IMatchRound = {
            ...old.data,
            rounds: updatedRounds || [],
            status: status.matchFinished ? 'FINISHED' : (old.data.status as any),
            winnerId: status.matchFinished && status.winnerId ? status.winnerId : old.data.winnerId,
          }

          return { ...old, data: updatedMatch }
        })
      }

      // Update ongoing match list if score changes or finished
      queryClient.setQueryData(['all-ongoing-match', null], (old: IApiResponse<ICardMatch[]> | undefined) => {
        if (!old || !old.data) return old
        return {
          ...old,
          data: old.data.map((m) => {
            if (m.uid === matchId) {
              return {
                ...m,
                status: status.matchFinished ? 'FINISHED' : m.status,
                // Optimistically update score display if ongoing match has score summary
                // (If listing shows score)
              }
            }
            return m
          }),
        }
      })
    })

    // Listen for general match updates (fallback)
    socket.on('match:update', (data: ICardMatch) => {
      console.log('[Socket] Match updated:', data)
      queryClient.setQueryData(['all-ongoing-match'], (old: IApiResponse<ICardMatch[]> | undefined) => {
        if (!old || !old.data) return old
        return {
          ...old,
          data: old.data.map((m) => (m.uid === data.uid ? data : m)),
        }
      })
    })

    return () => {
      if (tournamentId) {
        socket.emit('leave-tournament', tournamentId)
      }
      socket.disconnect()
    }
  }, [isMounted, tournamentId, queryClient])

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
  }
}

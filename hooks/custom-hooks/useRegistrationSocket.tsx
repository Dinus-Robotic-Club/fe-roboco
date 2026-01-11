'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

export const useRegistrationSocket = (tournamentId?: string, tournamentSlug?: string) => {
  const socketRef = useRef<Socket | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    // Connect to socket
    socketRef.current = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      if (tournamentId) {
        socket.emit('join-tournament', tournamentId)
      }
    })

    const onRegistrationUpdate = (data: { teamId: string; teamName: string; status: string }) => {
      console.log('Registration update received:', data)
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['get-all-teams'] }) // Correct key for useGetAllTeams

      // Specifically for the tournament dashboard details
      if (tournamentId) {
        queryClient.invalidateQueries({ queryKey: ['detail-tournament', tournamentId] }) // Invalidate by ID
      }
      if (tournamentSlug) {
        queryClient.invalidateQueries({ queryKey: ['detail-tournament', tournamentSlug] }) // Invalidate by Slug (used by useGetDetailTournament)
      }

      queryClient.invalidateQueries({ queryKey: ['team-profile'] })

      toast.info(`Status registrasi tim ${data.teamName} diperbarui: ${data.status}`)
    }

    const onAttendanceUpdate = (data: { teamId: string; teamName: string; isPresent: boolean }) => {
      console.log('Attendance update received:', data)
      queryClient.invalidateQueries({ queryKey: ['get-all-teams'] })

      if (tournamentId) {
        // Find tournament detail queries if needed, typically attendance is shown in participant list or match detail
      }

      toast.info(`Absensi tim ${data.teamName} diperbarui: ${data.isPresent ? 'Hadir' : 'Tidak Hadir'}`)
    }

    const onGroupsGenerate = () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-group'] })
      queryClient.invalidateQueries({ queryKey: ['detail-tournament'] })
      toast.success('Grup berhasil dibuat!')
    }

    const onMatchGroupCreate = () => {
      queryClient.invalidateQueries({ queryKey: ['referee-matches'] })
      queryClient.invalidateQueries({ queryKey: ['all-ongoing-match'] })
      queryClient.invalidateQueries({ queryKey: ['detail-tournament'] })
      queryClient.invalidateQueries({ queryKey: ['get-all-group'] })
      queryClient.invalidateQueries({ queryKey: ['ongoing-match-id'] }) // User specific
      queryClient.invalidateQueries({ queryKey: ['history-match-id'] }) // User specific
      toast.success('Match berhasil dibuat!')
    }

    // New Listeners for Real-time Match Updates
    const invalidateMatchQueries = () => {
      // Invalidate all potential match lists to ensure syncing
      queryClient.invalidateQueries({ queryKey: ['referee-matches'] })
      queryClient.invalidateQueries({ queryKey: ['all-ongoing-match'] }) // General
      queryClient.invalidateQueries({ queryKey: ['detail-tournament'] })

      // Dashboard User Keys (Must match exactly what is used in useGetOnGoingMatchById etc)
      queryClient.invalidateQueries({ queryKey: ['all-ongoing-match-byId'] })
      queryClient.invalidateQueries({ queryKey: ['all-history-match-byId'] })
    }

    const onMatchRoundCreate = () => {
      // console.log('Match round created')
      invalidateMatchQueries()
    }

    const onScoreUpdate = () => {
      // console.log('Score updated')
      invalidateMatchQueries()
    }

    const onEventCreate = () => {
      // console.log('Event created')
      invalidateMatchQueries()
    }

    const onMatchUpdate = () => {
      // console.log('Match updated') // e.g. Finished
      invalidateMatchQueries()
    }

    socket.on('registration:update', onRegistrationUpdate)
    socket.on('attendance:update', onAttendanceUpdate)
    socket.on('groups:generate', onGroupsGenerate)
    socket.on('match-group:create', onMatchGroupCreate)
    socket.on('match-round:create', onMatchRoundCreate)
    socket.on('score:update', onScoreUpdate)
    socket.on('event:create', onEventCreate)
    socket.on('match:update', onMatchUpdate)

    return () => {
      if (tournamentId) {
        socket.emit('leave-tournament', tournamentId)
      }
      socket.off('registration:update', onRegistrationUpdate)
      socket.off('attendance:update', onAttendanceUpdate)
      socket.off('groups:generate', onGroupsGenerate)
      socket.off('match-group:create', onMatchGroupCreate)
      socket.off('match-round:create', onMatchRoundCreate)
      socket.off('score:update', onScoreUpdate)
      socket.off('event:create', onEventCreate)
      socket.off('match:update', onMatchUpdate)
      socket.disconnect()
    }
  }, [queryClient, tournamentId, tournamentSlug])
}

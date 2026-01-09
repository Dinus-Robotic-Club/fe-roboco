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

    socket.on('registration:update', onRegistrationUpdate)

    return () => {
      if (tournamentId) {
        socket.emit('leave-tournament', tournamentId)
      }
      socket.off('registration:update', onRegistrationUpdate)
      socket.disconnect()
    }
  }, [queryClient, tournamentId, tournamentSlug])
}

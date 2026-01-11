'use client'

import { MatchListView } from '@/components/templates/match/match-list-view'
import { HeaderDashboard } from '@/components/ui/header'
import Loader from '@/components/ui/loader'
import { useAuth } from '@/context/auth-context'
import { useGetHistoryMatchById } from '@/hooks/useHistoryMatchById'
import { useGetOnGoingMatchById } from '@/hooks/useOnGoingMatchById'
import { useGetTournaments } from '@/hooks/useGetTournaments'
import { useSocket } from '@/hooks/useSocket'
import { IAuthUser } from '@/lib/types/auth'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

function MatchPageContent({ user }: { user: IAuthUser | null }) {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab')
  const [activeNav, setActiveNav] = useState(() => {
    return defaultTab === 'history' ? 'match-history' : 'on-going match'
  })

  // Get tournament for socket
  const { data: tournaments } = useGetTournaments()
  const tournamentId = tournaments?.data?.[0]?.uid || ''

  // Connect to socket for real-time updates
  const { isConnected } = useSocket(tournamentId)
  const queryClient = useQueryClient()

  // Fetch user's matches
  const { data: onGoing } = useGetOnGoingMatchById()
  const { data: history } = useGetHistoryMatchById()

  // Local state for real-time updates
  const [onGoingMatches, setOnGoingMatches] = useState<ICardMatch[]>([])
  const [historyMatches, setHistoryMatches] = useState<ICardMatch[]>([])

  // Initialize state from fetched data
  useEffect(() => {
    if (onGoing?.data) {
      setOnGoingMatches(onGoing.data)
    }
  }, [onGoing])

  useEffect(() => {
    if (history?.data) {
      setHistoryMatches(history.data)
    }
  }, [history])

  // Subscribe to query client updates (from useSocket hook events)
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated') {
        // Check for ongoing match updates
        if (event.query.queryKey[0] === 'all-ongoing-match-byId') {
          const data = event.query.state.data as { data: ICardMatch[] } | undefined
          if (data?.data) {
            setOnGoingMatches(data.data)
          }
        }
        // Check for history match updates
        if (event.query.queryKey[0] === 'all-history-match-byId') {
          const data = event.query.state.data as { data: ICardMatch[] } | undefined
          if (data?.data) {
            setHistoryMatches(data.data)
          }
        }
      }
    })

    return () => unsubscribe()
  }, [queryClient])

  // Use local state for rendering
  const displayOnGoing = onGoingMatches.length > 0 ? onGoingMatches : onGoing?.data || []
  const displayHistory = historyMatches.length > 0 ? historyMatches : history?.data || []

  let ComponentToRender

  if (activeNav === 'on-going match') {
    ComponentToRender = (
      <MatchListView data={displayOnGoing as ICardMatch[]} user={user} emptyTitle="BELUM ADA PERTANDINGAN" emptyDescription="Tim ini belum memiliki list pertandingan yang akan berlangsung." />
    )
  } else if (activeNav === 'match-history') {
    ComponentToRender = <MatchListView data={displayHistory as ICardMatch[]} user={user} emptyTitle="BELUM ADA RIWAYAT" emptyDescription="Tim ini belum menyelesaikan pertandingan apapun." />
  } else {
    ComponentToRender = null
  }

  return (
    <>
      <HeaderDashboard title="MATCH COLLECTION" />
      {/* Connection indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>
      <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans">
        <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
          <p
            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${activeNav === 'on-going match' ? 'bg-[#FBFF00]' : 'bg-transparent'}`}
            onClick={() => setActiveNav('on-going match')}>
            ON-GOING MATCH
          </p>
          <p
            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${activeNav === 'match-history' ? 'bg-[#FBFF00]' : 'bg-transparent'}`}
            onClick={() => setActiveNav('match-history')}>
            MATCH HISTORY
          </p>
        </nav>
        <div className="w-full h-auto flex flex-col items-center gap-10 my-20">{ComponentToRender}</div>
      </div>
    </>
  )
}

const MatchPage = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <Loader show />
  return (
    <Suspense fallback={<Loader show />}>
      <MatchPageContent user={user} />
    </Suspense>
  )
}

export default MatchPage

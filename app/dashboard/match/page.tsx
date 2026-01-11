'use client'

import MatchList from '@/components/templates/match/match-list'
import { FilterBar } from '@/components/templates/tools/filter'
import { Pagination } from '@/components/ui/pagination'
import { useMatchListControl } from '@/hooks/useMatchListControl'
import { CATEGORIES } from '@/lib'
import { useQueryClient } from '@tanstack/react-query'
import { IAuthUser } from '@/lib/types/auth'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { HeaderDashboard } from '@/components/ui/header'
import Loader from '@/components/ui/loader'
import { useAuth } from '@/context/auth-context'
import { useGetHistoryMatchById } from '@/hooks/useHistoryMatchById'
import { useGetOnGoingMatchById } from '@/hooks/useOnGoingMatchById'
import { useGetTournaments } from '@/hooks/useGetTournaments'
import { useSocket } from '@/hooks/useSocket'
import { useRegistrationSocket } from '@/hooks/custom-hooks/useRegistrationSocket'

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
  useRegistrationSocket(tournamentId)
  const queryClient = useQueryClient()

  // Fetch user's matches
  const { data: onGoing } = useGetOnGoingMatchById()
  const { data: history } = useGetHistoryMatchById()

  // Local state for real-time updates
  const [onGoingMatches, setOnGoingMatches] = useState<ICardMatch[]>([])
  const [historyMatches, setHistoryMatches] = useState<ICardMatch[]>([])

  // redundant useEffects removed to fix lint errors and rely on fallback logic
  // useEffect(() => {
  //   if (onGoing?.data) {
  //     setOnGoingMatches(onGoing.data)
  //   }
  // }, [onGoing])

  // useEffect(() => {
  //   if (history?.data) {
  //     setHistoryMatches(history.data)
  //   }
  // }, [history])

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

  // Determine data and empty state based on active tab
  const isHistory = activeNav === 'match-history'
  const currentData = isHistory ? displayHistory : displayOnGoing
  const emptyTitle = isHistory ? 'BELUM ADA RIWAYAT' : 'BELUM ADA PERTANDINGAN'
  const emptyDescription = isHistory ? 'Tim ini belum menyelesaikan pertandingan apapun.' : 'Tim ini belum memiliki list pertandingan yang akan berlangsung.'

  // Use List Control Hook
  const {
    state,
    setters: { setPage, setSearch, setCategory },
  } = useMatchListControl(currentData as ICardMatch[])

  // Reset pagination and filters when tab changes
  useEffect(() => {
    setPage(1)
    setSearch('')
    setCategory(CATEGORIES.ALL)
  }, [activeNav, setPage, setSearch, setCategory])

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
        <div className="w-full h-auto flex flex-col items-center gap-10 my-20">
          <div className="w-full flex flex-col gap-6 items-center">
            <FilterBar search={state.search} category={state.category} onSearchChange={setSearch} onCategoryChange={setCategory} />

            <MatchList data={state.data} user={user} emptyTitle={emptyTitle} emptyDescription={emptyDescription} />

            <Pagination currentPage={state.page} totalPages={state.totalPages} onPageChange={setPage} totalItems={state.totalItems} itemsPerPage={state.limit} />
          </div>
        </div>
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

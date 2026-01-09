'use client'

import { Suspense, useEffect } from 'react'
import { Playoff } from '@/components/templates/bracket/bracket'
import MatchList from '@/components/templates/match/match-list'
import { BasisRank } from '@/components/templates/table-rank/com-rank'
import { GroupRank } from '@/components/templates/table-rank/group-rank'
import { Footer } from '@/components/ui/footer'
import { HeaderDashboard } from '@/components/ui/header'
import Navbar from '@/components/ui/navbar'
import { useAuth } from '@/context/auth-context'
import { useGetAllGroup } from '@/hooks/useGetAllGroups'
import { useGetCommunityByRank } from '@/hooks/useGetCommunityByRank'
import { useGetHistoryMatch } from '@/hooks/useGetHistoryMatch'
import { useGetOnGoingMatch } from '@/hooks/useGetOnGoingMatch'
import { useGetTournaments } from '@/hooks/useGetTournaments'
import { useGetPlayoff } from '@/hooks/useGetPlayoff'
import { useLeagueboardSocket } from '@/hooks/custom-hooks/useLeagueboardSocket'
import { nav_home, nav_legaueboard } from '@/lib/statis-data'
import { useState } from 'react'
import { IAuthUser } from '@/lib/types/auth'
import Loader from '@/components/ui/loader'

const LeagueboardContent = ({ session }: { session: IAuthUser | null }) => {
  const [activeNav, setActiveNav] = useState('basis-rank')

  // Initial data fetch via suspense queries
  const { data: onGoing } = useGetOnGoingMatch()
  const { data: history } = useGetHistoryMatch()
  const { data: communityByRank } = useGetCommunityByRank()
  const { data: tournaments } = useGetTournaments()
  const tournamentId = tournaments?.data?.[0]?.uid || ''
  const { data: groups } = useGetAllGroup(tournamentId)
  const { data: playoffData } = useGetPlayoff(tournamentId)

  // Socket hook for real-time updates
  const { isConnected, initializeData, onGoingMatches, historyMatches, communityRank, groups: socketGroups, soccerBracket, sumoBracket } = useLeagueboardSocket(tournamentId)

  // Initialize socket state with fetched data
  useEffect(() => {
    if (onGoing?.data || history?.data || communityByRank?.data || groups?.data || playoffData?.data) {
      initializeData({
        onGoingMatches: onGoing?.data || [],
        historyMatches: history?.data || [],
        communityRank: communityByRank?.data || undefined,
        groups: groups?.data || [],
        playoffData: playoffData?.data || null,
      })
    }
  }, [onGoing?.data, history?.data, communityByRank?.data, groups?.data, playoffData?.data, initializeData])

  // Use socket state if available, fallback to query data
  const displayOnGoing = onGoingMatches.length > 0 ? onGoingMatches : onGoing?.data || []
  const displayHistory = historyMatches.length > 0 ? historyMatches : history?.data || []
  const displayCommunityRank = communityRank || communityByRank?.data
  const displayGroups = socketGroups.length > 0 ? socketGroups : groups?.data || []
  const displaySoccerBracket = soccerBracket
  const displaySumoBracket = sumoBracket

  const filteredData = displayGroups.filter((group) => {
    const isSoccerGroup = group.teams.some((t) => t.team.category === 'SOCCER')
    if (activeNav === 'group-rank-soccer') {
      return isSoccerGroup
    } else if (activeNav === 'group-rank-sumo') {
      return !isSoccerGroup
    }
    return true
  })

  let ComponentToRender

  if (activeNav === 'basis-rank') {
    ComponentToRender = <BasisRank data={displayCommunityRank?.communities || []} />
  } else if (activeNav === 'group-rank-soccer') {
    ComponentToRender = <GroupRank data={filteredData || []} title="SOCCER" />
  } else if (activeNav === 'group-rank-sumo') {
    ComponentToRender = <GroupRank data={filteredData || []} title="SUMO" />
  } else if (activeNav === 'on-going match') {
    ComponentToRender = <MatchList data={displayOnGoing as ICardMatch[]} user={session} type="user" />
  } else if (activeNav === 'match-history') {
    ComponentToRender = <MatchList data={displayHistory as ICardMatch[]} user={session} type="user" />
  } else if (activeNav === 'playoff-sumo') {
    ComponentToRender =
      displaySumoBracket.length > 0 ? (
        <Playoff title="Playoff SUMO" matches={displaySumoBracket} />
      ) : (
        <div className="text-center py-20 text-gray-500">Bracket belum tersedia. Fase grup harus selesai terlebih dahulu.</div>
      )
  } else if (activeNav === 'playoff-soccer') {
    ComponentToRender =
      displaySoccerBracket.length > 0 ? (
        <Playoff title="Playoff SOCCER" matches={displaySoccerBracket} />
      ) : (
        <div className="text-center py-20 text-gray-500">Bracket belum tersedia. Fase grup harus selesai terlebih dahulu.</div>
      )
  } else ComponentToRender = null

  const handleClickNav = (key: string) => {
    setActiveNav(key)
  }

  return (
    <div className="bg-grid h-full w-full">
      <Navbar left={nav_home.left} right={nav_home.right} />
      <HeaderDashboard title="LEAGUEBOARD" name=" " />
      {/* Connection indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>
      <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans mb-20">
        <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
          {nav_legaueboard.map((data) => (
            <p
              key={data.key}
              className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${activeNav === data.key ? 'bg-[#FBFF00]' : 'bg-transparent'}`}
              onClick={() => handleClickNav(data.key)}>
              {data.label}
            </p>
          ))}
        </nav>
        <div className="w-full h-full flex flex-col items-center gap-20 mt-20 lg:px-10 ">{ComponentToRender}</div>
      </div>
      <Footer />
    </div>
  )
}

const LeagueboardPage = () => {
  const { user: session, isLoading } = useAuth()

  if (isLoading && !session) return <Loader show />

  return (
    <Suspense fallback={<Loader show />}>
      <LeagueboardContent session={session} />
    </Suspense>
  )
}

export default LeagueboardPage

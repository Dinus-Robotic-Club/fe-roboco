'use client'

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
import { transformPlayoffToMatchBracket } from '@/lib/api/playoff'
import { nav_home, nav_legaueboard } from '@/lib/statis-data'
import { useState, useMemo } from 'react'
import { IAuthUser } from '@/lib/types/auth'
import Loader from '@/components/ui/loader'

const Leagueboard = ({ session }: { session: IAuthUser | null }) => {
  const [activeNav, setActiveNav] = useState('basis-rank')

  const { data: onGoing, isLoading: isOngoingLoading } = useGetOnGoingMatch()
  const { data: history, isLoading: isHistoryLoading } = useGetHistoryMatch()
  const { data: communityByRank, isLoading: isRankLoading } = useGetCommunityByRank()
  const { data: tournaments, isLoading: isTournamentsLoading } = useGetTournaments()
  const { data: groups, isLoading: isGroupsLoading } = useGetAllGroup(tournaments?.data?.[0]?.uid || '')
  const { data: playoffData, isLoading: isPlayoffLoading } = useGetPlayoff(tournaments?.data?.[0]?.uid || '')

  const isLoading = isOngoingLoading || isHistoryLoading || isRankLoading || isTournamentsLoading || isGroupsLoading || isPlayoffLoading

  // Transform playoff data to bracket format
  const soccerBracketMatches = useMemo(() => {
    if (!playoffData?.data?.soccer) return []
    return transformPlayoffToMatchBracket(playoffData.data.soccer)
  }, [playoffData])

  const sumoBracketMatches = useMemo(() => {
    if (!playoffData?.data?.sumo) return []
    return transformPlayoffToMatchBracket(playoffData.data.sumo)
  }, [playoffData])

  const filteredData = groups?.data?.filter((group) => {
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
    ComponentToRender = <BasisRank data={communityByRank?.data?.communities || []} />
  } else if (activeNav === 'group-rank-soccer') {
    ComponentToRender = <GroupRank data={filteredData || []} title="SOCCER" />
  } else if (activeNav === 'group-rank-sumo') {
    ComponentToRender = <GroupRank data={filteredData || []} title="SUMO" />
  } else if (activeNav === 'on-going match') {
    ComponentToRender = <MatchList data={onGoing?.data as ICardMatch[]} user={session} type="user" />
  } else if (activeNav === 'match-history') {
    ComponentToRender = <MatchList data={history?.data as ICardMatch[]} user={session} type="user" />
  } else if (activeNav === 'playoff-sumo') {
    ComponentToRender =
      sumoBracketMatches.length > 0 ? (
        <Playoff title="Playoff SUMO" matches={sumoBracketMatches} />
      ) : (
        <div className="text-center py-20 text-gray-500">Bracket belum tersedia. Fase grup harus selesai terlebih dahulu.</div>
      )
  } else if (activeNav === 'playoff-soccer') {
    ComponentToRender =
      soccerBracketMatches.length > 0 ? (
        <Playoff title="Playoff SOCCER" matches={soccerBracketMatches} />
      ) : (
        <div className="text-center py-20 text-gray-500">Bracket belum tersedia. Fase grup harus selesai terlebih dahulu.</div>
      )
  } else ComponentToRender = null

  const handleClickNav = (key: string) => {
    setActiveNav(key)
  }
  return (
    <div className="bg-grid h-full w-full">
      <Loader show={isLoading} />
      <Navbar left={nav_home.left} right={nav_home.right} />
      <HeaderDashboard title="LEAGUEBOARD" name=" " />
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

  return <Leagueboard session={session} />
}

export default LeagueboardPage

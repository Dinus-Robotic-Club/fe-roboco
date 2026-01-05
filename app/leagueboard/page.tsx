'use client'

import { Playoff } from '@/components/templates/bracket/bracket'
import MatchList from '@/components/templates/match/match-list'
import { BasisRank } from '@/components/templates/table-rank/com-rank'
import { GroupRank } from '@/components/templates/table-rank/group-rank'
import { Footer } from '@/components/ui/footer'
import { HeaderDashboard } from '@/components/ui/header'
import Loader from '@/components/ui/loader'
import Navbar from '@/components/ui/navbar'
import { useAuth } from '@/context/auth-context'
import { useGetAllGroup } from '@/hooks/useGetAllGroups'
import { useGetCommunityByRank } from '@/hooks/useGetCommunityByRank'
import { useGetHistoryMatch } from '@/hooks/useGetHistoryMatch'
import { useGetOnGoingMatch } from '@/hooks/useGetOnGoingMatch'
import { useGetTournaments } from '@/hooks/useGetTournaments'
import { bracket6Teams, bracket8Teams, nav_home, nav_legaueboard } from '@/lib/statis-data'
import { Suspense, useState } from 'react'

const Leagueboard = () => {
  const [activeNav, setActiveNav] = useState('basis-rank')
  const { user: session, isLoading } = useAuth()
  const { data: onGoing } = useGetOnGoingMatch()
  const { data: history } = useGetHistoryMatch()
  const { data: communityByRank } = useGetCommunityByRank()
  const { data: tournaments } = useGetTournaments()
  const { data: groups } = useGetAllGroup(tournaments?.data?.[0]?.uid || '')

  if (isLoading) {
    return <Loader show />
  }

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
    ComponentToRender = <BasisRank data={communityByRank.data?.communities} />
  } else if (activeNav === 'group-rank-soccer') {
    ComponentToRender = <GroupRank data={filteredData || []} title="SOCCER" />
  } else if (activeNav === 'group-rank-sumo') {
    ComponentToRender = <GroupRank data={filteredData || []} title="SUMO" />
  } else if (activeNav === 'on-going match') {
    ComponentToRender = <MatchList data={onGoing?.data as ICardMatch[]} user={session} type="user" />
  } else if (activeNav === 'match-history') {
    ComponentToRender = <MatchList data={history?.data as ICardMatch[]} user={session} type="user" />
  } else if (activeNav === 'playoff-sumo') {
    ComponentToRender = <Playoff title="Playoff SUMO" matches={bracket6Teams} />
  } else if (activeNav === 'playoff-soccer') {
    ComponentToRender = <Playoff title="Playoff SOCCER" matches={bracket8Teams} />
  } else ComponentToRender = null

  const handleClickNav = (key: string) => {
    setActiveNav(key)
  }
  return (
    <div className="bg-grid h-full w-full">
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
  return (
    <Suspense fallback={<></>}>
      <Leagueboard />
    </Suspense>
  )
}

export default LeagueboardPage

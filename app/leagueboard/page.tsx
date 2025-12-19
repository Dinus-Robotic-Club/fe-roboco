'use client'
import BasisRank from '@/component/leagueboard/BasisRank'
import GroupRankSoccer from '@/component/leagueboard/GroupRankSoccer'
import GroupRankSumo from '@/component/leagueboard/GroupRankSumo'
import HistoryMatch from '@/component/match/HistoryMatch'
import OngoingMatch from '@/component/match/OngoingMatch'
import Footer from '@/component/ui/Footer'
import Loader from '@/component/ui/Global/loader'
import Navbar from '@/component/ui/Global/Navbar'
import HeaderDashboard from '@/component/ui/HeaderDashboard'
import { useAuth } from '@/context/auth-context'
import { useAllMatchPage } from '@/hooks/function/useMatch'
import { useGetAllGroup } from '@/hooks/queries/useGroup'
import { useGetCommunityByRank } from '@/hooks/queries/useTeams'
import { useTournaments } from '@/hooks/queries/useTournaments'
import { nav_home, nav_legaueboard } from '@/lib'
import { Suspense, useState } from 'react'

const Leagueboard =  () =>  {
  const [activeNav, setActiveNav] = useState('basis-rank')
  const { user: session, isLoading } = useAuth()
  const { history, onGoing } = useAllMatchPage()
  const { data: communityByRank } = useGetCommunityByRank()
  const { data: tournaments } = useTournaments()
  const { data: groups } = useGetAllGroup(tournaments?.data?.[0]?.uid || '')

  if (isLoading) {
    return <Loader show />
  }

  let ComponentToRender

  if (activeNav === 'basis-rank') {
    ComponentToRender = <BasisRank data={communityByRank.data?.communities} />
  } else if (activeNav === 'group-rank-soccer') {
    ComponentToRender = <GroupRankSoccer data={groups?.data || []} />
  } else if (activeNav === 'group-rank-sumo') {
    ComponentToRender = <GroupRankSumo data={groups?.data || []} />
  } else if (activeNav === 'on-going match') {
    ComponentToRender = <OngoingMatch data={onGoing?.data as ICardMatch[]} user={session} />
  } else if (activeNav === 'match-history') {
    ComponentToRender = <HistoryMatch data={history?.data as ICardMatch[]} />
  } else if (activeNav === 'playoff-sumo') {
    // ComponentToRender = <OngoingMatch data={onGoing?.data as ICardMatch[]} />
  } else if (activeNav === 'playoff-soccer') {
    // ComponentToRender = <OngoingMatch data={onGoing?.data as ICardMatch[]} />
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

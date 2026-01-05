'use client'

import Navbar from '@/components/ui/navbar'
import { bracket6Teams, nav_admin, nav_tournament } from '@/lib/statis-data'
import { HeaderDashboard } from '@/components/ui/header'
import { Suspense, useMemo, useState } from 'react'
import { Footer } from '@/components/ui/footer'
import { useGetDetailTournament } from '@/hooks/useGetDetailTournament'
import { useParams } from 'next/navigation'
import { ParticipantsList } from '@/components/templates/table-list/list-participants'
import { TeamList } from '@/components/templates/table-list/list-team'
import { useAuth } from '@/context/auth-context'
import Loader from '@/components/ui/loader'
import MatchList from '@/components/templates/match/match-list'
import { IAuthUser } from '@/lib/types/auth'
import { CategoryFilter, GroupRank } from '@/components/templates/table-rank/group-rank'
import { Playoff } from '@/components/templates/bracket/bracket'
import Config from '@/components/templates/config-turney/config'
import { useGenerateGroups } from '@/hooks/useGenerateGroups'
import { useCreateMatch } from '@/hooks/useCreateMatch'

const PageComponent = ({ session }: { session: IAuthUser | null }) => {
  const [isActiveNav, setIsActiveNav] = useState('overview')
  const [filter, setFilter] = useState<CategoryFilter>('ALL')

  const params = useParams()
  const tournamentSlug = params.slug as string

  const { data: tournamentDetail } = useGetDetailTournament(tournamentSlug)
  const { mutate: generateGroup, isPending: isGenerating } = useGenerateGroups(tournamentDetail?.data?.uid || '', tournamentSlug)
  const { mutate: createMatch, isPending: isCreating } = useCreateMatch(tournamentDetail?.data?.uid || '', tournamentSlug)

  // 3. Data Source & Filtering
  const allGroups = useMemo(() => tournamentDetail?.data?.groups || [], [tournamentDetail])

  const filteredGroups = useMemo(() => {
    return allGroups.filter((g) => {
      if (filter === 'ALL') return true
      return g.teams?.some((t) => t.team.category === filter)
    })
  }, [allGroups, filter])

  let componentToRender

  if (isActiveNav === 'teams') {
    componentToRender = <TeamList data={tournamentDetail.data as ITournamentData} type="admin" slug={tournamentSlug} />
  } else if (isActiveNav === 'participants') {
    componentToRender = <ParticipantsList data={tournamentDetail.data?.registrations?.map((reg) => reg.team) as ITeam[]} />
  } else if (isActiveNav === 'config') {
    componentToRender = <Config />
  } else if (isActiveNav === 'bracket') {
    componentToRender = <Playoff title="Playoff SUMO" matches={bracket6Teams} />
  } else if (isActiveNav === 'group') {
    componentToRender = <GroupRank data={filteredGroups} activeFilter={filter} onFilterChange={setFilter} type="admin" onCreate={() => generateGroup()} title="GROUP RANK" />
  } else if (isActiveNav === 'match') {
    componentToRender = <MatchList data={tournamentDetail.data?.matches as ICardMatch[]} user={session} type="admin" onCreate={() => createMatch()} />
  } else if (isActiveNav === 'user') {
    componentToRender = null
  } else {
    componentToRender = null
  }

  return (
    <div className="bg-grid h-full w-full">
      <Loader show={isGenerating || isCreating} />

      <Navbar left={nav_admin.left} right={nav_admin.right} />
      <HeaderDashboard title="Detail Turnamen" name=" " />
      <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans mb-20">
        <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
          {nav_tournament.map((data) => (
            <p
              key={data.key}
              className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${isActiveNav === data.key ? 'bg-[#FBFF00]' : 'bg-transparent'}`}
              onClick={() => setIsActiveNav(data.key)}>
              {data.label}
            </p>
          ))}
        </nav>
        <div className="w-full h-full flex flex-col items-center gap-20 mt-20 lg:px-10 ">{componentToRender}</div>
      </div>
      <Footer />
    </div>
  )
}

const Page = () => {
  const { isLoading, user: session } = useAuth()

  if (isLoading) return <Loader show />
  return (
    <Suspense fallback={<></>}>
      <PageComponent session={session as IAuthUser | null} />
    </Suspense>
  )
}

export default Page

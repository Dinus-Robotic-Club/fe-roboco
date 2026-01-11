'use client'

import { Suspense, useEffect } from 'react'
import Navbar from '@/components/ui/navbar'
import { nav_admin, nav_tournament } from '@/lib/statis-data'
import { HeaderDashboard } from '@/components/ui/header'
import { useMemo, useState } from 'react'
import { Footer } from '@/components/ui/footer'
import { useGetDetailTournament } from '@/hooks/useGetDetailTournament'
import { useParams } from 'next/navigation'
import { ParticipantsList } from '@/components/templates/table-list/list-participants'
import { TeamList } from '@/components/templates/table-list/list-team'
import { useAuth } from '@/context/auth-context'
import Loader from '@/components/ui/loader'
import { MatchListView } from '@/components/templates/match/match-list-view'
import { IAuthUser } from '@/lib/types/auth'
import { CategoryFilter, GroupRank } from '@/components/templates/table-rank/group-rank'
import { Playoff } from '@/components/templates/bracket/bracket'
import Config from '@/components/templates/config-turney/config'
import { useGenerateGroups } from '@/hooks/useGenerateGroups'
import { useCreateMatch } from '@/hooks/useCreateMatch'
import { UserManagement } from '@/components/templates/user-management/user-management'
import { useCreateUser } from '@/hooks/useCreateUser'
import { useGetAllUser } from '@/hooks/useGetAllUser'
import { useGetPlayoff } from '@/hooks/useGetPlayoff'
import { useGeneratePlayoff } from '@/hooks/useGeneratePlayoff'
import { transformPlayoffToMatchBracket } from '@/lib/api/playoff'
import { EmptyState } from '@/components/ui/empty'
import { Trophy } from 'lucide-react'
import { useSocket } from '@/hooks/useSocket'
import { useLeagueboardSocket } from '@/hooks/custom-hooks/useLeagueboardSocket'
import { useRegistrationSocket } from '@/hooks/custom-hooks/useRegistrationSocket'

const PageComponent = ({ session }: { session: IAuthUser | null }) => {
  const [isActiveNav, setIsActiveNav] = useState('overview')
  const [filter, setFilter] = useState<CategoryFilter>('ALL')
  const [bracketCategory, setBracketCategory] = useState<'SOCCER' | 'SUMO'>('SOCCER')

  const params = useParams()
  const tournamentSlug = params.slug as string

  const { data: tournamentDetail } = useGetDetailTournament(tournamentSlug)
  const tournamentId = tournamentDetail?.data?.uid || ''

  // Socket for real-time updates
  const { isConnected } = useSocket(tournamentId)
  const { initializeData, onGoingMatches: socketMatches, soccerBracket: socketSoccerBracket, sumoBracket: socketSumoBracket } = useLeagueboardSocket(tournamentId)

  // Real-time registration updates
  useRegistrationSocket(tournamentId, tournamentSlug)

  const { mutate: generateGroup, isPending: isGenerating } = useGenerateGroups(tournamentId, tournamentSlug)
  const { mutate: createMatch, isPending: isCreating } = useCreateMatch(tournamentId, tournamentSlug)
  const { mutate: createUser, isPending: isCreatingUser } = useCreateUser()
  const { data: allUser } = useGetAllUser()
  const { data: playoffData } = useGetPlayoff(tournamentId)
  const { mutate: generatePlayoff, isPending: isGeneratingPlayoff } = useGeneratePlayoff(tournamentId, tournamentSlug)

  // Initialize socket state with fetched data
  useEffect(() => {
    if (tournamentDetail?.data?.matches || playoffData?.data) {
      initializeData({
        onGoingMatches: tournamentDetail?.data?.matches || [],
        playoffData: playoffData?.data || null,
      })
    }
  }, [tournamentDetail?.data?.matches, playoffData?.data, initializeData])

  const isLoading = isGenerating || isCreating || isGeneratingPlayoff || isCreatingUser

  // Use socket data if available, fallback to query data
  const displayMatches = socketMatches.length > 0 ? socketMatches : tournamentDetail?.data?.matches || []

  // 3. Data Source & Filtering
  const allGroups = useMemo(() => tournamentDetail?.data?.groups || [], [tournamentDetail])

  const filteredGroups = useMemo(() => {
    return allGroups.filter((g) => {
      if (filter === 'ALL') return true
      return g.teams?.some((t) => t.team.category === filter)
    })
  }, [allGroups, filter])

  // Use socket brackets if available, fallback to transformed query data
  const soccerBracketMatches = useMemo(() => {
    if (socketSoccerBracket.length > 0) return socketSoccerBracket
    if (!playoffData?.data?.soccer) return []
    return transformPlayoffToMatchBracket(playoffData.data.soccer)
  }, [playoffData, socketSoccerBracket])

  const sumoBracketMatches = useMemo(() => {
    if (socketSumoBracket.length > 0) return socketSumoBracket
    if (!playoffData?.data?.sumo) return []
    return transformPlayoffToMatchBracket(playoffData.data.sumo)
  }, [playoffData, socketSumoBracket])

  const currentBracketMatches = bracketCategory === 'SOCCER' ? soccerBracketMatches : sumoBracketMatches

  let componentToRender

  if (isActiveNav === 'teams') {
    componentToRender = <TeamList data={tournamentDetail?.data as ITournamentData} type="admin" slug={tournamentSlug} />
  } else if (isActiveNav === 'participants') {
    componentToRender = <ParticipantsList data={tournamentDetail?.data?.registrations?.map((reg) => reg.team) as ITeam[]} />
  } else if (isActiveNav === 'config') {
    componentToRender = <Config tournamentId={tournamentId} tournamentSlug={tournamentSlug} settings={tournamentDetail?.data?.settings} />
  } else if (isActiveNav === 'bracket') {
    const hasBrackets = soccerBracketMatches.length > 0 || sumoBracketMatches.length > 0

    if (!hasBrackets) {
      componentToRender = (
        <EmptyState
          icon={Trophy}
          title="Bracket Belum Tersedia"
          description="Buat bracket playoff setelah fase grup selesai. Semua pertandingan grup harus diselesaikan terlebih dahulu."
          onCreate={() => generatePlayoff()}
          createLabel="Buat Bracket Playoff"
          className="w-full max-w-4xl"
        />
      )
    } else {
      componentToRender = (
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            {['SOCCER', 'SUMO'].map((cat) => (
              <button
                key={cat}
                onClick={() => setBracketCategory(cat as 'SOCCER' | 'SUMO')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 border
                ${bracketCategory === cat ? 'bg-[#FBFF00] border-[#FBFF00] text-black shadow-sm' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'}`}>
                {cat}
              </button>
            ))}
          </div>
          <Playoff title={`Playoff ${bracketCategory}`} matches={currentBracketMatches} />
        </div>
      )
    }
  } else if (isActiveNav === 'group') {
    componentToRender = <GroupRank data={filteredGroups} activeFilter={filter} onFilterChange={setFilter} type="admin" onCreate={() => generateGroup()} title="GROUP RANK" />
  } else if (isActiveNav === 'match') {
    componentToRender = <MatchListView data={displayMatches as ICardMatch[]} user={session} type="user" onCreate={() => createMatch()} />
  } else if (isActiveNav === 'user') {
    componentToRender = <UserManagement users={allUser?.data || []} onAddUser={(data) => createUser(data)} isPending={isCreatingUser} />
  } else {
    componentToRender = null
  }

  return (
    <div className="bg-grid h-full w-full">
      <Loader show={isLoading} />

      {/* Connection indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>

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
    <Suspense fallback={<Loader show />}>
      <PageComponent session={session as IAuthUser | null} />
    </Suspense>
  )
}

export default Page

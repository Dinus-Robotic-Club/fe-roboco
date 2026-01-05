import { MatchStatusHeader } from '@/components/ui/header'
import { Scoreboard } from '@/components/ui/score'
import { TeamDisplay } from '@/components/ui/team-display'
import { useCreateMatchRound } from '@/hooks/useCreateMatchRound'
import { IAuthUser } from '@/lib/types/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MatchDetailContent } from './match-detail'
import { ValidationModal } from '@/components/ui/modal'
import Loader from '@/components/ui/loader'

const CardMatch = ({ data, user }: { data: ICardMatch; user: IAuthUser | null }) => {
  const router = useRouter()
  const [showModalStart, setShowModalStart] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const { mutateAsync, isPending } = useCreateMatchRound()

  const goToMatch = async () => {
    await mutateAsync({ tourId: data.tournamentId, matchId: data.uid })
    router.push(`/admin/refree/match/${data.uid}`)
  }

  if (isPending) return <Loader show />

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'REFREE'
  const isLive = data?.status === 'ONGOING' || data?.status === 'LIVE'
  const isFinished = data?.status === 'FINISHED'

  const handleCardClick = () => {
    if (isAdmin && !isFinished) {
      setShowModalStart(true)
      return
    }
    setIsDetailOpen((prev) => !prev)
  }

  return (
    <div className="w-full transition-all duration-300">
      <div
        className={`
          relative w-full max-w-7xl mx-auto rounded-xl border bg-white overflow-hidden transition-all duration-300 cursor-pointer group
          ${isLive ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : isDetailOpen ? 'border-slate-300 shadow-md' : 'border-slate-200 hover:border-slate-300 shadow-sm'}
        `}>
        <div onClick={handleCardClick}>
          {isLive && <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none z-0"></div>}

          {/* Status Header */}
          <MatchStatusHeader isLive={isLive} isFinished={isFinished} category={data?.category} roundLabel={data?.roundLabel} />

          {/* Match Content */}
          <div className="relative z-10 p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between lg:gap-8">
              <TeamDisplay team={{ name: data.teamA.name, logo: data.teamA?.logo as string, communityName: data.teamA.community?.name as string }} align="left" />

              <Scoreboard scoreA={data?.scoreA} scoreB={data?.scoreB} isLive={isLive} isAdmin={isAdmin} isFinished={isFinished} isDetailOpen={isDetailOpen} />

              <TeamDisplay team={{ name: data.teamB.name, logo: data.teamB?.logo as string, communityName: data.teamB.community?.name as string }} align="right" />
            </div>
          </div>
        </div>

        {/* Dropdown Detail Animation */}
        <div
          className={`
            grid transition-all duration-300 ease-in-out
            ${isDetailOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
          `}>
          <div className="overflow-hidden">
            <MatchDetailContent data={data} />
          </div>
        </div>
      </div>

      {showModalStart && (
        <ValidationModal
          setShowModalStart={setShowModalStart}
          action={goToMatch}
          title="Masuk ke Pertandingan?"
          desc="Pertandingan ini belum selesai. Kamu akan diarahkan ke halaman kontrol admin."
          confirm_text="Ya, Kelola Match"
        />
      )}
    </div>
  )
}

export { CardMatch }

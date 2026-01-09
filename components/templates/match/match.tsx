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
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'

const CardMatch = ({ data, user }: { data: ICardMatch; user: IAuthUser | null }) => {
  const router = useRouter()
  const [showModalStart, setShowModalStart] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const { mutateAsync, isPending } = useCreateMatchRound()

  // Check if match is TBD (missing teams)
  const isTBD = !data.teamA || !data.teamB

  const goToMatch = async () => {
    if (isTBD) {
      toast.error('Match belum dapat dimulai karena tim belum ditentukan (TBD)')
      return
    }
    await mutateAsync({ tourId: data.tournamentId, matchId: data.uid })
    router.push(`/admin/refree/match/${data.uid}`)
  }

  if (isPending) return <Loader show />

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'REFREE'
  const isLive = data?.status === 'ONGOING' || data?.status === 'LIVE'
  const isFinished = data?.status === 'FINISHED'

  const handleCardClick = () => {
    // If TBD match, show info toast instead of modal
    if (isTBD && isAdmin && !isFinished) {
      toast.info('Match ini menunggu hasil dari match sebelumnya', {
        description: 'Tim akan ditentukan setelah babak sebelumnya selesai.',
      })
      return
    }

    if (isAdmin && !isFinished) {
      // If match is already LIVE/ONGOING, go directly to match control page
      if (isLive || data.status === 'ONGOING') {
        router.push(`/admin/refree/match/${data.uid}`)
        return
      }

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
          ${isTBD ? 'border-amber-300/50 bg-amber-50/30' : ''}
          ${isLive ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : isDetailOpen ? 'border-slate-300 shadow-md' : 'border-slate-200 hover:border-slate-300 shadow-sm'}
        `}>
        <div onClick={handleCardClick}>
          {isLive && <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none z-0"></div>}

          {/* TBD Warning Badge */}
          {isTBD && (
            <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold">
              <AlertTriangle size={12} />
              Menunggu
            </div>
          )}

          {/* Status Header */}
          <MatchStatusHeader isLive={isLive} isFinished={isFinished} category={data?.category as string} roundLabel={data?.roundLabel as string} />

          {/* Match Content */}
          <div className="relative z-10 p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 lg:gap-8">
              <TeamDisplay team={{ name: data.teamA?.name ?? 'TBD', logo: data.teamA?.logo as string, communityName: data.teamA?.community?.name as string }} align="left" isTBD={!data.teamA} />

              <Scoreboard scoreA={data?.scoreA} scoreB={data?.scoreB} isLive={isLive} isAdmin={isAdmin} isFinished={isFinished} isDetailOpen={isDetailOpen} />

              <TeamDisplay team={{ name: data.teamB?.name ?? 'TBD', logo: data.teamB?.logo as string, communityName: data.teamB?.community?.name as string }} align="right" isTBD={!data.teamB} />
            </div>

            {/* Referee Info */}
            {data.refree && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
                <span className="font-medium">Wasit:</span>
                <span className="text-slate-700">{data.refree.name}</span>
              </div>
            )}
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

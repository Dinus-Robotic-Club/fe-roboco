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
import { AlertTriangle, ChevronDown, FlagOff, Trophy, User } from 'lucide-react'
import { WalkoutModal } from '@/components/ui/walkout-modal'
import { useWalkoutMatch } from '@/hooks/useWalkoutMatch'
import { getWOStatus, TeamLogo } from '@/lib/function'

const CardMatch = ({ data, user }: { data: ICardMatch; user: IAuthUser | null }) => {
  const router = useRouter()
  const [showModalStart, setShowModalStart] = useState(false)
  const [showWalkoutModal, setShowWalkoutModal] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const { mutateAsync, isPending } = useCreateMatchRound()
  const { mutateAsync: walkout } = useWalkoutMatch()

  const handleWalkoutConfirm = async (winnerId: string) => {
    try {
      await walkout({ matchId: data.uid, winnerId })
      // Optimistic update or wait for invalidation (handled by hook)
      setShowWalkoutModal(false)
    } catch (err) {
      console.error(err)
    }
  }

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

  const isAdmin = user?.role === 'REFREE'
  const isLive = data?.status === 'ONGOING' || data?.status === 'LIVE'
  const isFinished = data?.status === 'FINISHED'
  const isWalkout = data?.status === 'WALKOUT'

  const handleCardClick = () => {
    if (isTBD && isAdmin && !isFinished) {
      toast.info('Match ini menunggu hasil dari match sebelumnya', {
        description: 'Tim akan ditentukan setelah babak sebelumnya selesai.',
      })
      return
    }

    if (isAdmin && !isFinished && !isWalkout && !isLive && !isTBD) {
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
    <div className="w-full py-2">
      <div
        onClick={handleCardClick}
        className={`
          group relative w-full max-w-7xl mx-auto overflow-hidden rounded-2xl bg-white transition-all duration-300
          border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1
          ${isLive ? 'shadow-[0_8px_30px_rgb(239,68,68,0.15)] ring-1 ring-red-500/20' : 'shadow-sm'}
          cursor-pointer
        `}>
        {/* --- 1. HEADER: Status & Category --- */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">{data?.category || 'MATCH'}</span>
            <span className="text-[10px] font-medium text-slate-400">• {data?.roundLabel || 'Group Stage'}</span>
          </div>

          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-bold animate-pulse">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> LIVE
              </span>
            )}

            {/* Indikator Walkout di Header */}
            {isWalkout && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-red-400 text-white rounded-full text-[10px] font-bold">
                <FlagOff size={10} /> WALKOUT
              </span>
            )}

            {!isWalkout && isFinished && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">FINAL</span>}

            {isTBD && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">
                <AlertTriangle size={10} /> WAITING
              </span>
            )}
          </div>
        </div>

        {/* --- 2. BODY: The Duel --- */}
        <div className="relative px-4 py-6 sm:px-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* TEAM A */}
            <div
              className={`flex flex-col items-center gap-3 text-center transition-opacity ${
                getWOStatus({ teamId: data.teamA?.uid, isWalkout, data: data.winnerId }) === 'LOSE' ? 'opacity-50' : 'opacity-100'
              }`}>
              <TeamLogo logo={data.teamA?.logo} name={data.teamA?.name} isTBD={!data.teamA} woStatus={getWOStatus({ teamId: data.teamA?.uid, isWalkout, data: data.winnerId })} />
              <div className="flex flex-col">
                <h3 className={`font-bold text-slate-800 leading-tight ${!data.teamA ? 'text-slate-400 italic' : ''} text-sm sm:text-base line-clamp-2`}>{data.teamA?.name || 'TBD'}</h3>
                <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate max-w-[100px] sm:max-w-[140px]">{data.teamA?.community?.name || '-'}</span>
              </div>
            </div>

            {/* CENTER: VS / SCORE / WO */}
            <div className="flex flex-col items-center justify-center min-w-[80px]">
              {isWalkout ? (
                // Tampilan Khusus Walkout
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-black text-red-400 tracking-tighter">W.O.</span>
                  <span className="text-[10px] font-bold text-white bg-red-400 px-2 py-0.5 rounded">Menang WO</span>
                </div>
              ) : data.status === 'PENDING' ? (
                // Tampilan Belum Mulai
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-black text-slate-200 tracking-tighter">VS</span>
                  <span className="text-[10px] font-medium text-slate-400 px-2 py-1 rounded bg-slate-50">Belum Mulai</span>
                </div>
              ) : (
                // Tampilan Skor Normal
                <div className="flex items-center gap-3">
                  <span className={`text-3xl sm:text-4xl font-black tracking-tighter ${data.scoreA > data.scoreB ? 'text-slate-900' : 'text-slate-400'}`}>{data.scoreA}</span>
                  <span className="text-xs font-bold text-slate-300">-</span>
                  <span className={`text-3xl sm:text-4xl font-black tracking-tighter ${data.scoreB > data.scoreA ? 'text-slate-900' : 'text-slate-400'}`}>{data.scoreB}</span>
                </div>
              )}
            </div>

            {/* TEAM B */}
            <div
              className={`flex flex-col items-center gap-3 text-center transition-opacity ${
                getWOStatus({ teamId: data.teamB?.uid || '', isWalkout: isWalkout, data: data.winnerId }) === 'LOSE' ? 'opacity -50' : 'opacity-100'
              }`}>
              <TeamLogo
                logo={data.teamB?.logo}
                name={data.teamB?.name || 'TBD'}
                isTBD={!data.teamB}
                woStatus={getWOStatus({ teamId: data.teamB?.uid || '', isWalkout: isWalkout, data: data.winnerId })}
              />
              <div className="flex flex-col">
                <h3 className={`font-bold text-slate-800 leading-tight ${!data.teamB ? 'text-slate-400 italic' : ''} text-sm sm:text-base line-clamp-2`}>{data.teamB?.name || 'TBD'}</h3>
                <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate max-w-[100px] sm:max-w-[140px]">{data.teamB?.community?.name || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- 3. FOOTER --- */}
        <div className="relative mt-2 px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 text-slate-400">
            <User size={14} />
            <span className="text-[11px] font-medium truncate max-w-[120px]">{data.refree?.name || 'Belum ada wasit'}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className={`transition-transform duration-300 ${isDetailOpen ? 'rotate-180' : ''} text-slate-300`}>
              <ChevronDown size={18} />
            </div>

            {/* Tombol Walkout tidak muncul jika statusnya sudah Walkout atau Finished */}
            {isAdmin && !isFinished && !isLive && !isTBD && !isWalkout && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowWalkoutModal(true)
                }}
                className="z-20 flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-400 border border-red-200 rounded-full text-[10px] font-bold transition-all duration-300 uppercase tracking-wider group/btn shadow-md hover:shadow-xl hover:shadow-red-200">
                Walkout
                <Trophy size={12} className="group-hover/btn:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* --- 4. DETAILS --- */}
        <div className={`grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDetailOpen ? 'grid-rows-[1fr] border-t border-slate-100' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden bg-slate-50/50">
            <MatchDetailContent data={data} />
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {showModalStart && (
        <ValidationModal setShowModalStart={setShowModalStart} action={goToMatch} title="Masuk ke Pertandingan?" desc="Anda akan masuk sebagai Admin untuk mengelola skor." confirm_text="Ya, Kelola" />
      )}

      <WalkoutModal isOpen={showWalkoutModal} onClose={() => setShowWalkoutModal(false)} onConfirm={handleWalkoutConfirm} teamA={data.teamA} teamB={data.teamB} />
    </div>
  )
}

export { CardMatch }

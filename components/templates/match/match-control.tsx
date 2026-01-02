'use client'

import { TeamScoreCard } from '@/components/ui/card'
import { HeaderDashboard } from '@/components/ui/header'
import { ValidationModal } from '@/components/ui/modal'
import { useMatchLogic } from '@/hooks/custom-hooks/useMatchLogic'
import { ArrowLeftIcon, FlagTriangleRightIcon, Pause, Play } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import MatchAction from './match-action'

export default function MatchControlInterface({ roundId }: { roundId: string }) {
  const router = useRouter()
  const { matchData, state, actions } = useMatchLogic(roundId)
  const [showFinishModal, setShowFinishModal] = useState(false)

  if (!matchData) return null

  const isSumo = state.matchType === 'SUMO'

  return (
    <div className="min-h-screen bg-slate-50/50">
      <HeaderDashboard title={`${isSumo ? 'Sumo' : 'Soccer'} Control`} name="Admin" />

      <main className="max-w-5xl mx-auto p-4 md:p-6 pb-24">
        {/* MATCH INFO HEADER */}
        <div className="text-center mb-8">
          <span className="bg-white border border-slate-200 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-slate-500 uppercase shadow-sm">
            {matchData.group?.name || 'Bracket'} — Round {matchData.rounds.map((round) => round.roundNumber) ?? 1}
          </span>
        </div>

        {/* SCOREBOARD CARD */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-transparent via-[#FBFF00] to-transparent opacity-80" />

          <div className="p-6 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            {/* HOME TEAM */}
            <TeamScoreCard
              name={matchData.teamA.name}
              school={matchData.teamA.community?.name as string}
              logo={matchData.teamA.logo as string}
              score={state.homeScore}
              roundsWon={state.homeRoundsWon}
              isSumo={isSumo}
              align="left"
            />

            {/* TIMER CENTER */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="bg-slate-900 text-white rounded-2xl px-8 py-4 shadow-lg shadow-slate-900/20 mb-2">
                <span className={`text-5xl font-fira-code font-bold tracking-wider ${state.secondsLeft < 10 && state.isPlaying ? 'text-red-400 animate-pulse' : ''}`}>{state.timeString}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Game Time</span>
            </div>

            {/* AWAY TEAM */}
            <TeamScoreCard
              name={matchData.teamB.name}
              school={matchData.teamB.community?.name as string}
              logo={matchData.teamB.logo as string}
              score={state.awayScore}
              roundsWon={state.awayRoundsWon}
              isSumo={isSumo}
              align="right"
            />
          </div>
        </div>

        {/* CONTROLS & ACTIONS */}
        <div className="mt-8 grid gap-8">
          {/* Game Actions (Goal, Foul, Card) */}
          {/* Pass handler dari hook ke component UI ini */}
          <MatchAction startMatch={state.isPlaying} handleScoreAction={(type, team) => actions.handleAction(type as 'GOAL' | 'PENALTY' | 'YELLOW' | 'RED', team)} timeline={state.timeline} />

          {/* Bottom Floating Control Bar */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-2xl rounded-2xl p-2 flex items-center justify-between gap-2 z-50">
            <button onClick={() => router.back()} className="p-3 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors" title="Back">
              <ArrowLeftIcon size={20} />
            </button>

            <div className="h-8 w-px bg-slate-200 mx-1" />

            <button
              onClick={actions.toggleTimer}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all active:scale-95 ${
                state.isPlaying ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-900 text-[#FBFF00] hover:bg-slate-800 shadow-lg shadow-slate-900/20'
              }`}>
              {state.isPlaying ? (
                <>
                  <Pause size={20} fill="currentColor" /> Pause Match
                </>
              ) : (
                <>
                  <Play size={20} fill="currentColor" /> Start Match
                </>
              )}
            </button>

            {!isSumo && (
              <button onClick={() => setShowFinishModal(true)} className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Finish Round">
                <FlagTriangleRightIcon size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Modal Confirmation (Only for Manual Finish / Soccer) */}
        {showFinishModal && (
          <ValidationModal setShowModalStart={setShowFinishModal} action={actions.handleManualFinish} title="Selesaikan Ronde?" desc="Aksi ini tidak dapat dibatalkan." confirm_text="Ya, Selesaikan" />
        )}
      </main>
    </div>
  )
}

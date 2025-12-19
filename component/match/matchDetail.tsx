import { formatDate, getCategoryTheme } from '@/lib/func'
import { Calendar, Clock, Trophy, Layers, Zap, Flag, Activity, TrendingUp, CircleDot, Info } from 'lucide-react'

// Stat Bar Universal
const StatBar = ({ label, valueA, valueB, total, theme }: any) => {
  const percentA = total > 0 ? (valueA / total) * 100 : 0
  const percentB = total > 0 ? (valueB / total) * 100 : 0

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between text-xs font-bold text-slate-600">
        <span>{valueA}</span>
        <span className="uppercase tracking-widest font-semibold text-slate-400 text-[10px]">{label}</span>
        <span>{valueB}</span>
      </div>
      <div className="flex w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
        <div style={{ width: `${percentA}%` }} className={`h-full ${theme.colorA} transition-all duration-500`} />
        {total === 0 && <div className="w-full h-full bg-slate-200/50"></div>}
        <div style={{ width: `${percentB}%` }} className={`h-full ${theme.colorB} transition-all duration-500`} />
      </div>
    </div>
  )
}

// --- 3. MAIN COMPONENT ---
export const MatchDetailContent = ({ data }: { data: ICardMatch }) => {
  // Ambil konfigurasi tema berdasarkan kategori data
  const theme = getCategoryTheme(data.category)
  const EventIcon = theme.icon

  // Data Processing
  const sortedEvents = [...data.events].sort((a, b) => a.minute - b.minute)
  const hasEvents = sortedEvents.length > 0

  const scoreA = Number(data.scoreA) || 0
  const scoreB = Number(data.scoreB) || 0
  const totalScore = scoreA + scoreB

  // Mencari siapa yang mencetak poin pertama (Universal "First Blood")
  const firstEvent = sortedEvents[0]
  const openingTime = firstEvent ? (data.category === 'SUMO' ? `Round ${firstEvent.minute}` : `${firstEvent.minute}'`) : '-'

  return (
    <div className="bg-slate-50/50 rounded-b-xl border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* --- BAGIAN 1: METADATA GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-b border-slate-200 bg-white">
        {/* Date */}
        <div className="p-4 flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400 border border-slate-100">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Schedule</p>
            <p className="text-sm font-semibold text-slate-800">{formatDate(data.createdAt)}</p>
          </div>
        </div>
        {/* Category & Stage */}
        <div className="p-4 flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400 border border-slate-100">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{data.category}</span>
              <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">{data.roundLabel}</span>
            </div>
          </div>
        </div>
        {/* Format */}
        <div className="p-4 flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400 border border-slate-100">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System</p>
            <p className="text-sm font-semibold text-slate-800">Best Of {data.bestOf}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* --- BAGIAN 2: STATISTIK GLOBAL (Left) --- */}
        <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white lg:bg-transparent">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            Match Statistics
          </h3>

          <div className="space-y-8">
            {/* Insight Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Total Points */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                <span className="text-slate-400 mb-1">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <span className="text-xl font-bold text-slate-800 tabular-nums">{totalScore}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Total Score</span>
              </div>
              {/* Opening Score */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                <span className="text-slate-400 mb-1">
                  <Zap className="w-4 h-4" />
                </span>
                <span className="text-xl font-bold text-slate-800 tabular-nums line-clamp-1 ">{openingTime}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Opening Score</span>
              </div>
            </div>

            {/* Comparison Bars */}
            <div className="space-y-6">
              <StatBar label="Final Score" valueA={scoreA} valueB={scoreB} total={totalScore} theme={theme} />

              <StatBar
                label="Event Frequency"
                valueA={data.events.filter((e) => e.teamId === data.teamA.uid).length}
                valueB={data.events.filter((e) => e.teamId === data.teamB.uid).length}
                total={data.events.length}
                theme={theme}
              />
            </div>

            {/* Footer Note */}
            <div className="flex items-start gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-blue-600/80 leading-relaxed">Statistik berdasarkan data event yang terekam secara real-time dari sistem turnamen.</p>
            </div>
          </div>
        </div>

        {/* --- BAGIAN 3: TIMELINE UNIVERSAL (Right) --- */}
        <div className="lg:col-span-8 p-6 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Match Timeline
          </h3>

          <div className="relative pl-4 md:pl-0">
            {/* Center Line */}
            <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-slate-300 -translate-x-1/2 md:translate-x-0 border-l border-dashed border-slate-300"></div>

            {/* START Node */}
            <div className="relative z-10 flex md:justify-center mb-8">
              <div className="bg-white text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5 uppercase tracking-wide">
                <Flag className="w-3 h-3" /> Start
              </div>
            </div>

            {/* Empty State */}
            {!hasEvents ? (
              <div className="py-12 text-center relative z-10">
                <div className="inline-flex flex-col items-center justify-center opacity-50">
                  <CircleDot className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-slate-400 text-sm font-medium">No events recorded yet</p>
                </div>
              </div>
            ) : (
              // Events List
              <div className="space-y-5">
                {sortedEvents.map((event) => {
                  const isTeamA = event.teamId === data.teamA.uid

                  const timeDisplay =
                    data.category === 'SUMO'
                      ? `R${event.minute}` // Round
                      : `${event.minute}'` // Minute

                  return (
                    <div key={event.uid} className={`relative z-10 flex w-full items-center ${isTeamA ? 'md:flex-row' : 'md:flex-row-reverse'} gap-4 md:gap-0`}>
                      {/* Time/Round Badge */}
                      <div className="absolute left-[19px] md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex items-center justify-center z-20">
                        <span className="text-xs font-bold text-slate-600 font-mono tracking-tighter">{timeDisplay}</span>
                      </div>

                      {/* Spacer Mobile */}
                      <div className="w-10 md:hidden shrink-0"></div>

                      {/* Event Card */}
                      <div className={`flex-1 flex ${isTeamA ? 'md:justify-end md:pr-10' : 'md:justify-start md:pl-10'} justify-start`}>
                        <div
                          className={`
                           group flex items-center gap-3 px-4 py-3 rounded-xl border w-full md:w-auto md:min-w-60 shadow-sm hover:shadow-md transition-all duration-300
                           bg-white border-slate-100
                         `}>
                          {/* Icon Container (Dynamic Color) */}
                          <div
                            className={`
                            p-2 rounded-lg shrink-0 transition-colors
                            ${isTeamA ? theme.bgIconA : theme.bgIconB}
                          `}>
                            <EventIcon className="w-4 h-4" />
                          </div>

                          {/* Content */}
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                              {/* Gunakan tipe event dari API atau default label dari theme */}
                              {event.type || theme.label}
                            </span>
                            <span className="text-sm font-bold text-slate-800 leading-tight">{isTeamA ? data.teamA.name : data.teamB.name}</span>
                          </div>

                          {/* Point Value (Optional visual flair) */}
                          <div className="ml-auto pl-4 border-l border-slate-100">
                            <span className="text-lg font-bold text-slate-200 group-hover:text-slate-300 transition-colors">+1</span>
                          </div>
                        </div>
                      </div>

                      {/* Spacer Desktop */}
                      <div className="hidden md:flex flex-1"></div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* FINISH Node */}
            {data.status === 'FINISHED' && (
              <div className="relative z-10 flex md:justify-center mt-8">
                <div className="bg-slate-800 text-white text-[10px] font-bold px-4 py-1.5 rounded-full border border-slate-700 shadow-lg tracking-wider uppercase">Match Finished</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

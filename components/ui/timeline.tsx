import { ACTIONS_CONFIG } from '@/lib'
import { IThemeConfig, ITimelineAction } from '@/lib/types'

const TimelineMatch = ({ event, teamA, teamB, category, theme }: { event: IMatchEvent; teamA: ITeam; teamB: ITeam; category: string; theme: IThemeConfig }) => {
  const isTeamA = event.teamId === teamA.uid
  const timeDisplay = category === 'SUMO' ? `R${event.minute}` : `${event.minute}'`
  const EventIcon = theme.icon

  return (
    <div className={`relative z-10 flex w-full items-center ${isTeamA ? 'md:flex-row' : 'md:flex-row-reverse'} gap-4 md:gap-0 group`}>
      {/* Badge Waktu */}
      <div className="absolute left-4.75 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center z-20 group-hover:scale-110 transition-transform duration-300">
        <span className="text-[10px] font-bold text-slate-600 font-mono tracking-tighter">{timeDisplay}</span>
      </div>

      {/* Spacer Mobile */}
      <div className="w-10 md:hidden shrink-0" />

      {/* Content Card */}
      <div className={`flex-1 flex ${isTeamA ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-12'} justify-start`}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-slate-200 transition-all duration-300 w-full md:w-auto md:min-w-50">
          <div className={`p-2 rounded-lg shrink-0 ${isTeamA ? theme.bgIconA : theme.bgIconB}`}>
            <EventIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 truncate">{event.type || theme.label}</span>
            <span className="text-xs font-bold text-slate-800 leading-tight truncate">{isTeamA ? teamA.name : teamB.name}</span>
          </div>
          <div className="ml-auto pl-3 border-l border-slate-50">
            <span className="text-sm font-bold text-emerald-500">+1</span>
          </div>
        </div>
      </div>

      {/* Spacer Desktop */}
      <div className="hidden md:flex flex-1" />
    </div>
  )
}

export const TimelineItem = ({ event }: { event: ITimelineAction }) => {
  const isHome = event.team === 'home'
  const config = ACTIONS_CONFIG.find((c) => c.type === event.type)

  return (
    <div className="flex items-center w-full gap-4 text-sm relative">
      {/* Home Side */}
      <div className={`flex-1 flex items-center justify-end gap-3 ${isHome ? 'opacity-100' : 'opacity-0'}`}>
        <span className="font-semibold text-slate-700 truncate max-w-30">{event.name}</span>
        <div className={`p-1.5 rounded-md bg-white border border-slate-100 shadow-sm ${config?.textColor}`}>{config?.icon}</div>
      </div>

      {/* Center Time Axis */}
      <div className="shrink-0 w-12 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-mono font-bold text-slate-600 z-10 border-2 border-white shadow-sm">{event.time}</div>

      {/* Connecting Line (Optional Aesthetic) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-100 -z-0" />

      {/* Away Side */}
      <div className={`flex-1 flex items-center justify-start gap-3 ${!isHome ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`p-1.5 rounded-md bg-white border border-slate-100 shadow-sm ${config?.textColor}`}>{config?.icon}</div>
        <span className="font-semibold text-slate-700 truncate max-w-30">{event.name}</span>
      </div>
    </div>
  )
}

export { TimelineMatch }

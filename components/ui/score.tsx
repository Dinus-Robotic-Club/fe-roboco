import { IScoreboardProps } from '@/lib/types'
import { ChevronDown } from 'lucide-react'

const Scoreboard = ({ scoreA, scoreB, isLive, isAdmin, isFinished, isDetailOpen }: IScoreboardProps) => (
  <div className="flex flex-col items-center justify-center gap-2 w-full lg:w-auto py-4 lg:py-0 order-2">
    <div
      className={`
        flex items-center justify-center px-4 py-2 rounded-lg min-w-25 lg:min-w-35 gap-3
        ${isLive ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 text-slate-800'}
      `}>
      <span className="text-3xl lg:text-4xl font-bold font-mono tracking-tighter tabular-nums">{scoreA}</span>
      <span className={`text-sm font-light opacity-60 ${isLive ? 'text-red-100' : 'text-slate-400'}`}>-</span>
      <span className="text-3xl lg:text-4xl font-bold font-mono tracking-tighter tabular-nums">{scoreB}</span>
    </div>

    {(!isAdmin || isFinished) && (
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 group-hover:text-slate-600 transition-colors">
        Details
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isDetailOpen ? 'rotate-180' : ''}`} />
      </div>
    )}

    {isAdmin && !isFinished && <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-500 mt-1">Manage Match</div>}
  </div>
)

export { Scoreboard }

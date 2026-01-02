import { IMatchNodeProps } from '@/lib/types'
import { TeamRow } from '../ui/row-bracket'

export const BracketLayout: React.FC<IMatchNodeProps> = ({ match, className, hoveredTeamId, setHoveredTeamId }) => {
  const teamA = match.teams[0]
  const teamB = match.teams[1]

  const scoreA = match.score?.[0]
  const scoreB = match.score?.[1]

  const isMatchDone = match.status === 'Completed'
  const winnerIndex = scoreA > scoreB ? 0 : scoreB > scoreA ? 1 : -1

  const isLoserGoHome = match.nextMatchLoseId === null

  const isElimA = isMatchDone && winnerIndex === 1 && isLoserGoHome
  const isElimB = isMatchDone && winnerIndex === 0 && isLoserGoHome

  return (
    <div className={`relative w-65 flex flex-col rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md border border-gray-200/60 ${className}`}>
      {/* Header Match Info */}
      <div className="bg-gray-50/80 backdrop-blur-sm py-1.5 px-3 flex justify-between items-center border-b border-gray-200">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{match.name.replace('Match', '').replace('Upper Bracket', 'UB').replace('Lower Bracket', 'LB')}</span>

        {match.status === 'Live' ? (
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-red-50 rounded-full border border-red-100">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
            <span className="text-[9px] font-bold text-red-600 uppercase tracking-wide">Live</span>
          </div>
        ) : match.status === 'Completed' ? (
          <span className="text-[9px] font-medium text-gray-400">Final</span>
        ) : (
          <span className="text-[9px] font-medium text-gray-400">Upcoming</span>
        )}
      </div>

      {/* Teams Container */}
      <div className="flex flex-col bg-white">
        <TeamRow team={teamA || { id: 'tbd-1', name: 'TBD' }} isTop={true} hoveredTeamId={hoveredTeamId} setHoveredTeamId={setHoveredTeamId} score={scoreA} isEliminated={isElimA} />
        <TeamRow team={teamB || { id: 'tbd-2', name: 'TBD' }} isTop={false} hoveredTeamId={hoveredTeamId} setHoveredTeamId={setHoveredTeamId} score={scoreB} isEliminated={isElimB} />
      </div>
    </div>
  )
}

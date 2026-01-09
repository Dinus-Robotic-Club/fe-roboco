import { ITeamRowProps } from '@/lib/types'
import { getImageUrl } from '@/lib/function'
import Image from 'next/image'

export const TeamRow: React.FC<ITeamRowProps> = ({ team, isTop, hoveredTeamId, setHoveredTeamId, score, isEliminated }) => {
  const isValidTeam = team && team.id && !team.id.toLowerCase().includes('tbd') && team.id !== 'bye'

  const isHovered = isValidTeam && hoveredTeamId && team?.id === hoveredTeamId

  const baseBg = isEliminated ? 'bg-neutral-900' : team?.isWinner ? 'bg-yellow-50' : 'bg-white'
  const borderClass = isEliminated ? 'border-l-[3px] border-l-red-600 border-y-red-900/30' : isTop ? 'border-b border-gray-100' : ''
  const textClass = isEliminated ? 'text-gray-400' : 'text-gray-800'
  const scoreClass = isEliminated ? 'text-red-500' : team?.isWinner ? 'text-green-600' : 'text-gray-800'

  return (
    <div
      className={`relative flex items-center justify-between px-3 py-2.5 transition-all duration-200 
      ${baseBg} 
      ${borderClass}
      ${isHovered && !isEliminated ? 'bg-blue-50' : ''}
      ${isValidTeam ? 'cursor-pointer' : 'cursor-default'} 
      `}
      onMouseEnter={() => {
        if (isValidTeam) setHoveredTeamId(team.id)
      }}
      onMouseLeave={() => setHoveredTeamId(null)}>
      {isEliminated && <div className="absolute inset-0 bg-black/10 pointer-events-none" />}

      <div className="flex items-center gap-3 relative z-10">
        <div className={`w-7 h-7 flex items-center justify-center rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm bg-white`}>
          <Image width={40} height={40} src={getImageUrl(team?.logoUrl)} alt={team?.name ?? 'TBD'} className="w-full h-full object-contain p-0.5" unoptimized />
        </div>

        <span className={`text-xs font-semibold uppercase tracking-tight line-clamp-1 max-w-30 ${textClass}`} title={team?.name}>
          {team?.name ?? 'TBD'}
        </span>
      </div>

      <span className={`font-mono text-sm font-bold relative z-10 ${scoreClass}`}>{score !== undefined ? score : '-'}</span>
    </div>
  )
}

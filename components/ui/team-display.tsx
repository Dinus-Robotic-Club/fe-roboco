import { getImageUrl } from '@/lib/function'
import { ITeamDisplayProps } from '@/lib/types'
import Image from 'next/image'

const TeamDisplay = ({ team, align }: ITeamDisplayProps) => {
  const isRight = align === 'right'

  return (
    <div className={`flex items-center ${isRight ? 'justify-end' : 'justify-start'} w-full lg:w-1/3 gap-3 lg:gap-4 order-${isRight ? '3' : '1'}`}>
      <div className={`flex ${isRight ? 'flex-row' : 'lg:flex-row-reverse'} items-center w-full gap-3 lg:gap-4`}>
        <div className="relative w-12 h-12 lg:w-16 lg:h-16 shrink-0">
          <Image src={getImageUrl(team.logo)} alt={team.name} fill className="object-contain drop-shadow-sm" unoptimized />
        </div>

        <div className={`flex flex-col ${isRight ? 'items-start grow' : 'lg:items-end grow'}`}>
          <h3 className={`font-bold text-slate-800 text-lg lg:text-xl leading-tight line-clamp-1 ${isRight ? 'text-left lg:text-right w-full' : 'text-right lg:text-left w-full'}`}>{team.name}</h3>
          <p className={`text-slate-500 text-xs lg:text-sm font-medium ${isRight ? 'w-full text-left' : 'w-full text-right lg:text-left'}`}>{team.communityName}</p>
        </div>
      </div>
    </div>
  )
}

export { TeamDisplay }

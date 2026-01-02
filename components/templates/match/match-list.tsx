import { EmptyState } from '@/components/ui/empty'
import { IMatchListProps } from '@/lib/types'
import { CardMatch } from './match'

function MatchList({ data, user, emptyTitle = 'COMING SOON', emptyDescription = 'Arena Pertandingan Robot Segera Tiba...' }: IMatchListProps) {
  if (!data || data.length === 0) {
    return <EmptyState variant="public" className="w-full max-w-4xl h-auto" title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      {data.map((match) => (
        <CardMatch key={match.uid} data={match} user={user} />
      ))}
    </div>
  )
}

export default MatchList

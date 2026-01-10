import { EmptyState } from '@/components/ui/empty'
import { IMatchListProps } from '@/lib/types'
import { CardMatch } from './match'
import { Trophy } from 'lucide-react'

function MatchList({ data, user, emptyTitle = 'COMING SOON', emptyDescription = 'Arena Pertandingan Robot Segera Tiba...', type = 'user', onCreate }: IMatchListProps) {
  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        variant="public"
        icon={Trophy}
        onCreate={type === 'refree' ? onCreate : undefined}
        createLabel="Buat Match"
        className="w-full max-w-4xl h-auto"
      />
    )
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

import { BracketDouble } from '@/components/bracket/double-elim'

export const Playoff = ({ title, matches }: { title: string; matches: IMatchBracket[] }) => {
  return (
    <div className="w-full max-w-full flex flex-col items-center">
      <h1 className="uppercase font-bold text-2xl md:text-4xl my-6 text-center">{title}</h1>
      <div className="w-full overflow-hidden p-4">
        <BracketDouble matches={matches} />
      </div>
    </div>
  )
}

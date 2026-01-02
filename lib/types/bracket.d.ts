interface IMatchBracket {
  id: string
  name: string
  teams: [TeamBracket | null, TeamBracket | null]
  status: 'Scheduled' | 'Live' | 'Completed'
  score: [number, number]
  nextMatchWinId?: string | null
  nextMatchLoseId?: string | null
  nextMatchWinSlotIsB?: boolean | null
  nextMatchLoseSlotIsB?: boolean | null
}
interface ITeamBracket {
  id: string
  name: string
  logoUrl?: string
  isWinner?: boolean
}

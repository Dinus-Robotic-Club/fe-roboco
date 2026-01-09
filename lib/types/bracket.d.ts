interface IMatchBracket {
  id: string
  matchUid?: string // Backend match uid for socket updates
  name: string
  teams: [TeamBracket | null, TeamBracket | null]
  status: 'Scheduled' | 'Live' | 'Completed'
  score: [number, number]
  category?: 'SOCCER' | 'SUMO' | null
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

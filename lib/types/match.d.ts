interface ICardMatch {
  uid: string
  tournamentId: string
  groupId: string | null
  bracketId: string | null
  teamAId: string
  teamBId: string
  bestOf: number
  scoreA: number
  scoreB: number

  nextMatchWinId: string | null
  nextMatchLoseId: string | null
  nextMatchWinSlotIsB: boolean
  nextMatchLoseSlotIsB: boolean

  winnerId: string | null
  status: 'FINISHED' | 'LIVE' | 'UPCOMING' | string
  roundLabel: string
  category: 'SOCCER' | string

  createdAt: string
  updatedAt: string

  teamA: ITeam
  teamB: ITeam
  group: IGroup | null
  events: IMatchEvent[]
  score: IScore[]
}

interface IGroup {
  uid: string
  tournamentId: string
  name: string
  createdAt: string
}

// 3. Type untuk Events (Gol, Kartu, dll)
interface IMatchEvent {
  uid: string
  matchId: string
  teamId: string
  roundId: string
  groupTeamId: string
  type: 'GOAL' | string // Union type untuk antisipasi tipe event lain
  value: number
  minute: number
  timestamp: string
}

// 5. Type untuk Response API (Array of Matches)
type IMatchListResponse = IMatch[]

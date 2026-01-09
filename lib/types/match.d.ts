type typeEvent = 'GOAL' | 'KNOCKOUT' | 'YELLOW_CARD' | 'RED_CARD' | 'PENALTY' | 'FOUL'

type MatchListResponse = ICardMatch[]

interface IMatch {
  uid: string
  tournamentId: string
  teamAId: string
  teamBId: string
  scoreA: number
  scoreB: number
  winnerId: string | null
  status: MatchStatus
  roundLabel: string
  category: TeamCategory
  updatedAt: string
}

interface ICardMatch {
  uid: string
  tournamentId: string
  groupId: string | null
  bracketId: string | null
  teamAId: string | null
  teamBId: string | null
  bestOf: number
  scoreA: number
  scoreB: number
  nextMatchWinId: string | null
  nextMatchLoseId: string | null
  nextMatchWinSlotIsB: boolean
  nextMatchLoseSlotIsB: boolean
  winnerId: string | null
  status: 'FINISHED' | 'LIVE' | 'UPCOMING' | 'ONGOING' | 'CANCELLED' | 'PENDING'
  roundLabel: string | null
  category: 'SOCCER' | 'SUMO' | null
  createdAt: string
  updatedAt: string
  teamA: ITeam | null
  teamB: ITeam | null
  group: IGroup | null
  events: IMatchEvent[]
  score?: IScore[]
  refree: IRefreeMatch | null
  rounds?: IRound[]
}

interface IRefreeMatch {
  uid: string
  name: string
  email: string
  role: string
  avatar: string | null
  createdAt: string
  updatedAt: string
}

interface IMatchEvent {
  uid: string
  matchId: string
  teamId: string
  roundId: string
  groupTeamId: string
  type: typeEvent
  value: number
  minute: number
  timestamp: string
}

interface IScore {
  golScore: number
  knockout: boolean
}

interface IScoreUpdateBody {
  teamId: string
  type: string
  value: number
  minute: number
}

interface IEndRoundResponse {
  matchId: string
  roundId: string
  matchFinished: boolean
  winnerId: string | null
  updatedMatch?: {
    uid: string
    status: string
    winnerId: string | null
  }
}

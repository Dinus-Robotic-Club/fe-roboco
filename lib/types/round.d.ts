interface IMatchRound extends ICardMatch {
  rounds: IRound[]
}

interface IRound {
  uid: string
  matchId: string
  roundNumber: number
  winnerId: string | null
  scoreA: number
  scoreB: number
  status: string // Contoh: 'ACTIVE' | 'FINISHED'
  startTime: string
  endTime: string | null
  duration: number
  createdAt: string
}

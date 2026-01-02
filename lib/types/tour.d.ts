type PlayoffType = 'SINGLE_ELIM' | 'DOUBLE_ELIM'
type StageType = 'DOUBLE_STAGE' | 'SINGLE_STAGE' | 'GROUP_STAGE'

interface ITournamentData {
  uid: string
  name: string
  slug: string
  description: string
  image: string
  location: string
  startDate: string
  endDate: string
  stageType: StageType
  playoffType: PlayoffType
  createdAt: string
  updatedAt: string

  matches: Match[]
  groups: IGroupData[]
  registrations: IRegistrationData[]
  settings: ITournamentSettings
}

interface IGetAllTournaments {
  uid: string
  name: string
  slug: string
  description?: string
  totalTeam?: string
  startDate: string
  endDate: string
  image: string
  location: string
}

interface ITournamentSettings {
  uid: string
  tournamentId: string
  defaultBestOf: number
  groupBestOf: number
  upperBestOf: number
  lowerBestOf: number
  grandFinalBestOf: number
  roundDurationSoccer: number
  roundDurationSumo: number
  createdAt: string
  updatedAt: string
}

interface ICreateTournament {
  name: string | null
  slug: string | null
  description?: string | null
  startDate: string
  endDate?: string | null
  image?: File | null
  location?: string
  playoffType?: PlayoffType | null
  stageType: StageType | null
}

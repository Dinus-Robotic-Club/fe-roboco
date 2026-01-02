type TeamCategory = 'SOCCER' | 'SUMO'
type updateTeam = Partial<ITeamBody>

interface DashboardTeamData {
  team: ITeam
  communityStanding: ICommunityStanding
  groupStanding: IGroupStanding
  stats: ITeamStats
  matchHistory: IMatchHistory[]
}

interface ITeam {
  uid: string
  name: string
  email: string
  logo: string | null
  category: TeamCategory
  userId: string
  communityId: string | null
  createdAt: string
  updatedAt: string
  community: ICommunity | null
  groupTeams: IGroupTeam[]
  participants: IParticipant[]
  registrations?: IRegistrationData[]
}

interface ITeamDetail {
  uid: string
  email: string
  name: string
  logo: string
  community: string
  category: TeamCategory
  participants: IParticipant[]
  registrations: IRegistrationData[]
}

interface IGroupTeam {
  uid?: string
  teamId?: string
  groupId?: string
  point?: number
  golDifferent?: number
  golScore?: number
  createdAt?: string
  updatedAt?: string
}

interface ITeamTournament {
  uid: string
  name: string
  email: string
  logo: string // URL path
  category: TeamCategory
  userId: string
  communityId: string
  createdAt: string
  updatedAt: string
  // Relations
  community: ICommunity
  participants: IParticipantTournament[]
}

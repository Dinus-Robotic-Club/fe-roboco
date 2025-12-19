interface IBodyRegisterTeam {
  team: ITeamBody
  participants: IParticipantsBody[]
}

interface IParticipantsBody {
  participantsName: string
  participantsRoleInTeam: string
  participantsImage: File | null
  participantsIdentityCardImage: File | null
  participantsTwibbon: string
  participantsPhone: string
}

interface IUser {
  uid?: string
  email?: string
  name?: string
}

interface ITeamBody {
  name: string
  communityName: string
  password: string
  confirmPassword?: string
  category: string
  invoice: File | null
  email: string
  logo: File | null
  tournamentId: string
}

type TeamError = {
  [K in keyof ITeamBody]?: string
}

type ParticipantError = {
  [K in keyof IParticipantsBody]?: string
}

type RegisterError = {
  team: Partial<Record<keyof ITeamBody, string>>
  participants: Partial<Record<keyof IParticipantsBody, string>>[]
}

interface ILoginError {
  email?: string
  password?: string
  general?: string
}

interface DashboardTeamResponse {
  success: boolean
  status: number
  message: string
  data: DashboardTeamData
}

interface DashboardTeamData {
  team: Team
  communityStanding: CommunityStanding
  groupStanding: GroupStanding
  stats: TeamStats
  matchHistory: IMatchHistory[]
}

// Type untuk Score
interface IScore {
  golScore: number
  knockout: boolean
}

// Type untuk Community (Karena kamu select: true, semua field keambil)
// --- ENUMS ---
// Sesuaikan dengan Prisma Enum kamu
type MatchEventType = 'GOAL' | 'OWN_GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'PENALTY' | 'FOUL' | 'KNOCKOUT'

// --- SUB INTERFACES ---

interface ICommunity {
  uid: string
  name: string
  logo?: string | null
}

interface IScore {
  golScore: number
  knockout?: number | boolean // Bisa number (0/1) atau boolean tergantung handling di FE
}

interface IPlayer {
  name: string
}

// Type untuk Event/Log (Timeline)

// Type untuk Team di dalam Match
interface IMatchTeam {
  name: string
  logo: string | null
  community: ICommunity | null
  score: IScore[] | null // Array karena relasi one-to-many di Prisma
}

interface ITeam {
  uid: string
  name: string
  email: string
  logo: string | null
  category: 'SOCCER' | 'SUMO'
  userId: string
  communityId: string | null
  createdAt: string
  updatedAt: string
  community: Community | null
  groupTeams: GroupTeam[]
  participants: Participant[]
}

interface IParticipant {
  uid: string
  name: string
  teamId: string
  image: string
  identityCardImage: string
  phone: string
  twibbon: string
  roleInTeam: 'LEADER' | 'MEMBER'
  createdAt: string
  updatedAt: string
}

interface ICommunity {
  uid: string
  name: string
  comPoint: number
  createdAt: string
  updatedAt: string
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
  // tambah jika perlu tergantung struktur aslimu
}

interface ICommunityStanding {
  rank: number | null
  totalCommunity: number
}

interface IGroupStanding {
  groupRank: number | null
  groupStandings: IGroupStandingEntry[] | null
}

interface IGroupStandingEntry {
  teamId: string
  name: string
  point: number
  golDiff: number
  golScore: number
  rank: number
}

type updateTeam = Partial<ITeamBody>
type updateParticipant = Partial<Omit<IParticipantsBody, 'participantsIdentityImage'>>

interface ITeamStats {
  totalGolScore: number
  totalGolConceded: number
  matchWins: number
  matchLoses: number
}

interface IRegistration {
  uid: string
  qrUrl: string | null
}

interface ITeamDetail {
  uid: string
  email: string
  name: string
  logo: string
  community: string
  category: string
  participants: IParticipant[]
  registrations: IRegistration[]
}

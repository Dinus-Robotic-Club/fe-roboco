export interface IBodyRegisterTeam {
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

interface RegisterError {
    team?: TeamError
    participants?: ParticipantError[]
}

interface ILoginError {
    email?: string
    password?: string
    general?: string
}

export interface DashboardTeamResponse {
    success: boolean
    status: number
    message: string
    data: DashboardTeamData
}

export interface DashboardTeamData {
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
interface ICommunity {
    uid: string
    name: string
    // ... field community lainnya
}

// Type untuk Team di dalam Match
interface IMatchTeam {
    name: string
    logo: string | null
    community: ICommunity | null // Bisa null jika relasi opsional
    score: IScore[] | null // Prisma biasanya return Array [] untuk relasi one-to-many
}

// Type Utama (Result dari Query)
export interface IMatchHistory {
    uid: string
    createdAt: Date
    category: string // Atau Enum Category
    // ... field scalar Match lainnya (updatedAt, status, dll) akan otomatis terambil

    teamA: IMatchTeam
    teamB: IMatchTeam
}

export interface Team {
    uid: string
    name: string
    email: string
    logo: string | null
    category: string
    userId: string
    communityId: string | null
    createdAt: string
    updatedAt: string
    community: Community | null
    groupTeams: GroupTeam[]
    participants: Participant[]
}

export interface Participant {
    uid: string
    name: string
    teamId: string
    image: string
    identityCardImage: string
    phone: string
    twibbon: string
    roleInTeam: 'LEADER' | 'MEMBER' // bisa ditambah kalau ada role lain
    createdAt: string
    updatedAt: string
}

export interface Community {
    uid: string
    name: string
    comPoint: number
    createdAt: string
    updatedAt: string
}

export interface GroupTeam {
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

export interface CommunityStanding {
    rank: number | null
    totalCommunity: number
}

export interface GroupStanding {
    groupRank: number | null
    groupStandings: GroupStandingEntry[] | null
}

export interface GroupStandingEntry {
    teamId: string
    name: string
    point: number
    golDiff: number
    golScore: number
    rank: number
}

type updateTeam = Partial<ITeamBody>
type updateParticipant = Partial<Omit<IParticipantsBody, 'participantsIdentityImage'>>

export interface TeamStats {
    totalGolScore: number
    totalGolConceded: number
    matchWins: number
    matchLoses: number
}

export interface IParticipant {
    uid: string
    name: string
    roleInTeam: 'LEADER' | 'MEMBER'
    image: string
    twibbon: string
    phone: string
}

export interface IRegistration {
    uid: string
    qrUrl: string | null
}

export interface ITeamDetail {
    uid: string
    email: string
    name: string
    logo: string
    community: string
    category: string
    participants: IParticipant[]
    registrations: IRegistration[]
}

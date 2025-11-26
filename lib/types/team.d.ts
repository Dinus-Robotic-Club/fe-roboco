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

export interface TeamStats {
    totalGolScore: number
    totalGolConceded: number
    matchWins: number
    matchLoses: number
}

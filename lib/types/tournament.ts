// --- ENUMS & CONSTANTS ---
// Digunakan agar string tidak hardcoded dan lebih type-safe

export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type TeamRole = 'LEADER' | 'MEMBER'
export type TeamCategory = 'SOCCER' | 'SUMO' | string // Bisa disesuaikan jika ada kategori lain
export type StageType = 'DOUBLE_STAGE' | 'SINGLE_STAGE' | 'GROUP_STAGE'
export type PlayoffType = 'SINGLE_ELIM' | 'DOUBLE_ELIM'

// --- SUB-INTERFACES ---

export interface Community {
    uid: string
    name: string
    comPoint: number
    createdAt: string
    updatedAt: string
}

export interface Participant {
    uid: string
    name: string
    teamId: string
    image: string // URL path
    identityCardImage: string // URL path
    phone: string
    twibbon: string // URL or string
    roleInTeam: TeamRole
    createdAt: string
    updatedAt: string
}

export interface Team {
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
    community: Community
    participants: Participant[]
    groupTeams: any[] // Bisa diganti interface GroupTeam jika datanya sudah ada
}

export interface Registration {
    uid: string
    teamId: string
    tournamentId: string
    invoice: string // URL path
    status: RegistrationStatus
    registeredAt: string // ISO Date string
    verifiedAt: string | null
    createdAt: string
    updatedAt: string
    // Relations
    team: Team
}

export interface TournamentSettings {
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

// --- MAIN INTERFACE ---

export interface TournamentData {
    uid: string
    name: string
    slug: string
    description: string
    image: string // URL path
    location: string
    startDate: string // ISO Date string
    endDate: string // ISO Date string
    stageType: StageType
    playoffType: PlayoffType
    createdAt: string
    updatedAt: string
    // Relations
    matches: any[] // Bisa diganti interface Match jika datanya sudah ada
    registrations: Registration[]
    settings: TournamentSettings
}

// --- API RESPONSE WRAPPER ---
// Gunakan ini jika fetch langsung dari endpoint yg membungkus "data"

export interface TournamentApiResponse {
    data: TournamentData
}

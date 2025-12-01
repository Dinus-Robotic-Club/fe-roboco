export interface NavItem {
    title: string
    href: string
}

export interface NavData {
    left: NavItem[]
    right: NavItem[]
}

export interface IGetAllTournaments {
    uid: string
    name: string
    slug: string
    startDate: string
    endDate: string
    image: string
    location: string
}

export interface IGetAllCommunity {
    uid: string
    name: string
}

export enum PlayoffType {
    DOUBLE_ELIM = 'DOUBLE_ELIM',
    SINGLE_ELIM = 'SINGLE_ELIM',
}

export enum StageType {
    DOUBLE_STAGE = 'DOUBLE_STAGE',
    SINGLE_STAGE = 'SINGLE_STAGE',
}

export interface ICreateTournament {
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

export enum StatusCode {
    SUCCESS = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_ERROR = 500,
}

export interface IApiResponse<T> {
    success: boolean
    status: StatusCode
    message: string
    data?: T
    error?: T
}

export interface TeamData {
    name: string
    email: string
    category: string
    instansi: string
    present: boolean
    status: 'verified' | 'pending' | 'rejected' | string
}

export interface MemberData {
    name: string
    team: string
    category: string
    role: 'leader' | 'member' | string
    phone: string
}

export interface DownloadExcelTeamProps {
    filteredData: TeamData[]
}

export interface DownloadExcelMemberProps {
    filteredData: MemberData[]
}

import { LucideIcon } from 'lucide-react'

export type TournamentStatus = 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED'
export type TabId = 'overview' | 'registrations' | 'settings' | 'brackets' | 'matches' | 'teams'

export interface Team {
    name: string
    logo: string | null
}

export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type FilterType = 'ALL' | RegistrationStatus

export interface Community {
    uid: string
    name: string
    comPoint: number
}

export interface Participant {
    uid: string
    name: string
    roleInTeam: 'LEADER' | 'MEMBER'
    image: string
    phone: string
    twibbon: string
    identityCardImage: string
}

export interface Team {
    uid: string
    name: string
    email: string
    logo: string | null
    category: string
    community: Community
    participants: Participant[]
}

export interface Registration {
    uid: string
    teamId: string
    tournamentId: string
    invoice: string
    status: RegistrationStatus
    registeredAt: string
    team: Team
}

export interface RegistrationsTabProps {
    data: {
        registrations: Registration[]
        name: string
    }
    onUpdateStatus: (uid: string, newStatus: RegistrationStatus) => void
    formatDate: (date: string) => string
}
export interface TournamentData {
    name: string
    status: TournamentStatus
    description: string
    startDate: string
    endDate: string
    location: string
    registrations: Registration[]
}

export interface TournamentSettings {
    defaultBestOf: number
    groupBestOf: number
    upperBestOf: number
    lowerBestOf: number
    grandFinalBestOf: number
    roundDurationSoccer: number
    roundDurationSumo: number
}

export interface TabItem {
    id: TabId
    label: string
    icon: LucideIcon
    count?: number
}

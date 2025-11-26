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

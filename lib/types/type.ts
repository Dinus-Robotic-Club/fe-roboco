export interface NavItem {
    title: string
    href: string
}

export interface NavData {
    left: NavItem[]
    right: NavItem[]
}

export interface FormDataTeam {
    team_name: string
    team_logo: File | null
    kategori: string
    asal_instansi: string
}

export interface FormDataPlayer {
    player1_name: string
    player1_picture: File | null
    player1_twibbon: string
    player1_phone: string
    player2_name: string
    player2_picture: File | null
    player2_twibbon: string
    player2_phone: string
}

export interface IGetAllTournaments {
    uid: string
    name: string
    startDate: string
    endDate: string
    image: string
    location: string
}

export type TournamentResponse = IApiResponse<IGetAllTournaments[]>

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

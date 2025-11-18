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
}

export interface IResponseGetTour {
    data: IGetAllTournaments[]
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
    playoffType?: PlayoffType | null
    stageType: StageType | null
}

export interface IBodyCreateTournament {
    data: ICreateTournament
}

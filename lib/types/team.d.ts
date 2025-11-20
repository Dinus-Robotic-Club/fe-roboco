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

interface ITeamBody {
    name: string
    school: string
    password: string
    confirmPassword: string
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

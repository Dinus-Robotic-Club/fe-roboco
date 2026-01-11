type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface IRegistrationData {
  uid: string
  teamId: string
  tournamentId: string
  invoice: string // URL path
  status: RegistrationStatus
  qrUrl: string | null
  registeredAt: string // ISO Date string
  verifiedAt: string | null
  createdAt: string
  updatedAt: string
  attendance?: IAttendanceData | null
  team?: ITeam | null
}

interface IAttendanceData {
  uid: string
  registrationId: string
  isPresent: boolean
  scannedAt: string // ISO Date string
  scanndedBy: string
}

interface ITeamBody {
  name: string
  communityName: string
  password?: string
  confirmPassword?: string
  category: string
  invoice?: File | null
  email: string
  logo?: File | null
  tournamentId: string
}

interface IParticipantsBody {
  participantsName: string
  participantsRoleInTeam: string
  participantsImage?: File | null
  participantsIdentityCardImage?: File | null
  participantsTwibbon: string
  participantsPhone: string
}

interface ICreateTeamAdmin {
  name: string
  email: string
  communityName: string
  category: string
  tournamentId: string
  password?: string // Opsional
  // Array of strings (Sesuai request backend)
  participantsName: string[]
  participantsRoleInTeam: string[]
  participantsPhone: string[]
  participantsTwibbon: string[]
}

interface IBodyRegisterTeam {
  team: ITeamBody
  participants: IParticipantsBody[]
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

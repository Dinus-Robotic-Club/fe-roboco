type ParticipantRole = 'LEADER' | 'MEMBER'
type updateParticipant = Partial<Omit<IParticipantsBody, 'participantsIdentityImage'>>

interface IParticipant {
  uid: string
  name: string
  teamId: string
  image: string
  identityCardImage: string
  phone: string
  twibbon: string
  roleInTeam: ParticipantRole
  createdAt: string
  updatedAt: string
}

interface IParticipantTournament {
  uid: string
  name: string
  teamId: string
  image: string // URL path
  identityCardImage: string // URL path
  phone: string
  twibbon: string // URL or string
  roleInTeam: ParticipantRole
  createdAt: string
  updatedAt: string
}

import { ITeam } from './team'

interface IGroupTeamStats {
  uid: string
  groupId: string
  teamId: string
  seed: number | null
  point: number
  matchPlay: number
  golScore: number
  golConceded: number
  golDifferent: number
  knockoutScore: number
  knockoutConceded: number
  knockoutDifferent: number
  createdAt: string
  updatedAt: string
  team: ITeam
}

interface IGroupData {
  uid: string
  tournamentId: string
  name: string
  createdAt: string
  teams: IGroupTeamStats[]
}

interface IGroupResponse {
  data: IGroupData[]
}

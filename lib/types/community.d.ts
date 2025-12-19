export interface ICommunity {
  uid: string
  name: string
  comPoint: number
  rank: number
  team: ITeam[]
}

export interface ICommunityResponse {
  total: number
  communities: ICommunity[]
}

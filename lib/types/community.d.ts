interface ICommunityResponse {
  total: number
  communities: ICommunity[]
}

interface IGetAllCommunity {
  uid: string
  name: string
}

interface ICommunity {
  uid: string
  name: string
  logo?: string | null
  comPoint?: number
  rank?: number
  team: ITeam[]
  createdAt?: string
  updatedAt?: string
}

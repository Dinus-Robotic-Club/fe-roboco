type UserRole = 'ADMIN' | 'PARTICIPANT' | 'REFREE' | 'PENDAF'
type RefreeCategory = 'SUMO' | 'SOCCER' | 'BOTH'

interface IRegisterUserInput {
  email: string
  name: string
  password: string
  role: UserRole
  refereeCategory?: RefreeCategory
}

interface IUser {
  uid: string
  email: string
  name: string
  role: UserRole
  refereeCategory?: RefreeCategory
  createdAt: string
}

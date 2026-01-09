type UserRole = 'ADMIN' | 'PARTICIPANT' | 'REFREE' | 'PENDAF'

interface IRegisterUserInput {
  email: string
  name: string
  password: string
  role: UserRole
}

interface IUser {
  uid: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

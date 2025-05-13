import { Role } from './role'

export type SignInRequest = {
  type: number
  name: string
  password: string
}

export type SignInPayload = {
  expires: number
  token: string
}

export type ConsoleInfo = {
  id: string
  profile: ConsoleProfile
  roles: Roles
}

export type ConsoleProfile = {
  accountId: string
  nickname: string
  email: string
  avatar: string
}

export type Roles = Role[]
export type TinyRoles = string[]

export type CreateOrUpdateProfileResponse = {
  id: string
}

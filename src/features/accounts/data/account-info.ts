import { TinyRoles } from '@/lib/auth.ts'

export interface ConsoleProfile {
  nickname: string
  email: string
  avatar: string
}

export interface AccountInfo {
  id: string
  loginName: string
  profile: ConsoleProfile
  roles: TinyRoles
}

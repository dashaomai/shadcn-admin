import { useQuery } from '@tanstack/react-query'
import { apiBase } from '@/config/api'
import logger from 'loglevel'
import { fetchAuthed } from '@/stores/authStore'
import { ConsoleProfile, Roles } from '@/lib/auth'

export async function doSignIn(name: string, password: string) {
  const data = {
    type: 1,
    name,
    password,
  }

  const response = await fetch(`${apiBase}/auth/signIn`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (response.status === 200) {
    return response.json()
  } else if (response.status === 401) {
    logger.warn('sign in failed')
    return undefined
  }
}

export const getProfile = async (accountId?: string) => {
  return getPersonalData<ConsoleProfile>('/account/profile/', accountId)
}

export const getRoles = async (accountId?: string) => {
  return getPersonalData<Roles>('/account/roles/', accountId)
}

export const getPersonalData = async <T>(
  path: string,
  accountId?: string
): Promise<T | undefined> => {
  const response = await fetchAuthed<T>(`${path}${accountId ?? ''}`)

  if (response?.code === 200) {
    return response.payload
  }
}

export const useProfile = () =>
  useQuery({
    queryKey: ['self-profile'],
    queryFn: async () => getProfile(),
  })

export const useRoles = () =>
  useQuery({
    queryKey: ['self-roles'],
    queryFn: async () => getRoles(),
  })

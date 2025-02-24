import { useQuery } from '@tanstack/react-query'
import { apiBase } from '@/config/api'
import logger from 'loglevel'
import { fetchAuthed } from '@/stores/authStore'
import { ConsoleProfile, CreateOrUpdateProfileResponse, Roles } from '@/lib/auth'
import { PageRequest } from '@/lib/request.ts'
import { PageResponse } from '@/lib/response.ts'
import { CreateOrUpdateRoleResponse, Role } from '@/lib/role.ts'
import { RoleForm } from '@/features/roles/components/roles-action-dialog.tsx'
import { AccountInfo } from '@/features/accounts/data/account-info.ts'
import { AccountForm } from '@/features/accounts/components/accounts-action-dialog'

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
  return fetchAuthed<T>(`${path}${accountId ?? ''}`)
}

export const getAllRoles = async () => {
  return fetchAuthed<Roles>('/role/all')
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

export const useAllRoles = () =>
  useQuery({
    queryKey: ['all-roles'],
    queryFn: getAllRoles,
  })

export const listRoles = async (request: PageRequest) => {
  return fetchAuthed<PageResponse<Role>>(
    `/role/?page=${request.page}&limit=${request.limit}`
  )
}

export const createRole = async (values: RoleForm) => {
  const body = {
    name: values.name,
    description: values.description,
  }

  return fetchAuthed<CreateOrUpdateRoleResponse>('/role/', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export const updateRole = async (id: number, values: RoleForm) => {
  const body = {
    name: values.name,
    description: values.description,
  }

  return fetchAuthed<CreateOrUpdateRoleResponse>(`/role/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export const createOrUpdateRole = async (
  values: { id?: number } & RoleForm,
) => {
  if (!values.id) {
    return createRole(values)
  } else {
    const { id, ...data } = values
    return updateRole(id, data)
  }
}

export const deleteRole = async (id: number) => {
  return fetchAuthed<CreateOrUpdateRoleResponse>(`/role/${id}`, {
    method: 'DELETE',
  })
}


/****** Accounts *****/
export const listAccountInfos = async (request: PageRequest) => {
  return fetchAuthed<PageResponse<AccountInfo>>(
    `/account/?page=${request.page}&limit=${request.limit}`,
  )
}

const createProfile = async (values: AccountForm) => {
  return fetchAuthed<CreateOrUpdateProfileResponse>('/account/profile/', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

const updateProfile = async (id: string, values: AccountForm) => {
  return fetchAuthed<CreateOrUpdateProfileResponse>(`/account/profile/${id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  })
}


export const createOrUpdateAccountsProfile = async (
  values: { id?: string } & AccountForm,
) => {
  if (!values.id) {
    return createProfile(values)
  } else {
    const { id, ...data } = values
    return updateProfile(id, data)
  }
}
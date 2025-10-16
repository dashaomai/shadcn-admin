import { useQuery } from '@tanstack/react-query'
import logger from 'loglevel'
import { fetchAuthed } from '@/stores/authStore'
import {
  ConsoleProfile,
  CreateOrUpdateProfileResponse,
  Roles,
  TinyRoles,
} from '@/lib/auth'
import { PageRequest } from '@/lib/request.ts'
import { PageResponse } from '@/lib/response.ts'
import { CreateOrUpdateRoleResponse, Role } from '@/lib/role.ts'
import { AccountForm } from '@/features/accounts/components/accounts-action-dialog'
import { AccountRolesForm } from '@/features/accounts/components/accounts-roles-dialog'
import { AccountInfo } from '@/features/accounts/data/account-info.ts'
import { AnchorsForm } from '@/features/anchors/components/anchors-action-dialog.tsx'
import { RoleForm } from '@/features/roles/components/roles-action-dialog.tsx'
import { ProfileFormValues } from '@/features/settings/profile/profile-form'

export async function doSignIn(name: string, password: string) {
  const data = {
    type: 1,
    name,
    password,
  }

  const response = await fetch(`${import.meta.env.VITE_API_HOST}/auth/signIn`, {
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

export const updateProfile = async (
  profile: ProfileFormValues,
  accountId?: string
) => {
  return fetchAuthed<ConsoleProfile>(`/account/profile/${accountId ?? ''}`, {
    method: 'POST',
    body: JSON.stringify(profile),
  })
}

export const getRoles = async (accountId?: string) => {
  return getPersonalData<TinyRoles>('/account/roles/', accountId)
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
  values: { id?: number } & RoleForm
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
    `/account/?page=${request.page}&limit=${request.limit}`
  )
}

const createAccount = async (values: AccountForm) => {
  const data = {
    type: 1,
    name: values.loginName,
    password: values.password,
    nickname: values.profileNickname,
    email: values.profileEmail,
    avatar: values.profileAvatar,
  }

  return fetchAuthed<CreateOrUpdateProfileResponse>('/account/signUp', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

const updateAccount = async (id: string, values: AccountForm) => {
  if (values.password && values.password === values.passwordConfirm) {
    // update the password
    const data = {
      type: 1,
      password: values.password,
    }

    const passwordResponse = await fetchAuthed<CreateOrUpdateProfileResponse>(
      `/account/login/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    )

    if (!passwordResponse) {
      // failed to update the password
      return undefined
    }
  }

  const data = {
    nickname: values.profileNickname,
    email: values.profileEmail,
    avatar: values.profileAvatar,
  }
  return fetchAuthed<CreateOrUpdateProfileResponse>(`/account/profile/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const createOrUpdateAccount = async (
  values: { id?: string } & AccountForm
) => {
  if (!values.id) {
    return createAccount(values)
  } else {
    const { id, ...data } = values
    return updateAccount(id, data)
  }
}

export const updateAnchor = async ({
  id,
  ...values
}: AnchorsForm & { id?: string }) => {
  if (id) {
    return fetchAuthed<CreateOrUpdateProfileResponse>(`/account/anchor/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        ...values,
        status: Number(values.status),
        specialStatus: Number(values.specialStatus),
      }),
    })
  } else {
    console.error('failed to receive id for anchor.')
    return
  }
}

export const updateRoles = async (
  values: { id?: string } & AccountRolesForm
) => {
  const { id, roles } = values
  const data = {
    roles,
  }

  return fetchAuthed<CreateOrUpdateProfileResponse>(`/account/roles/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

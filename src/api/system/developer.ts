import { useQuery } from '@tanstack/react-query'
import { fetchAuthed } from '@/stores/authStore'
import { PageRequest } from '@/lib/request'
import { ActionPayload, PageResponse } from '@/lib/response'
import { DeveloperForm } from '@/features/developers/components/developers-action-dialog'
import { DeveloperInfo } from '@/features/developers/data/developer'

export type DeveloperActionPayload = ActionPayload<number>

export const listDevelopers = async (request: PageRequest) => {
  return fetchAuthed<PageResponse<DeveloperInfo>>(
    `/developer/?page=${request.page}&limit=${request.limit}`
  )
}

export const listAllDevelopers = async () => {
  return fetchAuthed<DeveloperInfo[]>(`/developer/all`)
}

export const createDeveloper = async (values: DeveloperForm) => {
  return fetchAuthed<DeveloperActionPayload>('/developer/', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export const updateDeveloper = async (id: number, values: DeveloperForm) => {
  return fetchAuthed<DeveloperActionPayload>(`/developer/${id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  })
}

export const createOrUpdateDeveloper = async (
  values: { id?: number } & DeveloperForm
) => {
  if (values.id) {
    return updateDeveloper(values.id, {
      ...values,
      type: Number(values.type),
      status: Number(values.status),
    })
  } else {
    return createDeveloper({
      ...values,
      type: Number(values.type),
      status: Number(values.status),
    })
  }
}

export const deleteDeveloper = async (id: number) => {
  return fetchAuthed<DeveloperActionPayload>(`/developer/${id}`, {
    method: 'DELETE',
  })
}

export const useAllDevelopers = () =>
  useQuery({
    queryKey: ['all-developers'],
    queryFn: listAllDevelopers,
  })

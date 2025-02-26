import { fetchAuthed } from '@/stores/authStore'
import { PageRequest } from '@/lib/request'
import { ActionPayload, PageResponse } from '@/lib/response'
import { PlatformForm } from '@/features/platforms/components/platforms-action-dialog'
import { PlatformInfo } from '@/features/platforms/data/platform'

export type PlatformActionPayload = ActionPayload<number>

export const listPlatforms = async (request: PageRequest) => {
  return fetchAuthed<PageResponse<PlatformInfo>>(
    `/platform/?page=${request.page}&limit=${request.limit}`
  )
}

export const listAllPlatforms = async () => {
  return fetchAuthed<PageResponse<PlatformInfo>>('/platform/all')
}

export const createPlatform = async (values: PlatformForm) => {
  return fetchAuthed<PlatformActionPayload>('/platform/', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export const updatePlatform = async (id: number, values: PlatformForm) => {
  return fetchAuthed<PlatformActionPayload>(`/platform/${id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  })
}

export const createOrUpdatePlatform = async (
  values: { id?: number } & PlatformForm
) => {
  if (!values.id) {
    return createPlatform(values)
  } else {
    const { id, ...data } = values
    return updatePlatform(id, data)
  }
}

export const deletePlatform = async (id: number) => {
  return fetchAuthed<PlatformActionPayload>(`/platform/${id}`, {
    method: 'DELETE',
  })
}

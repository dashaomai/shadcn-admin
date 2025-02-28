import { fetchAuthed } from '@/stores/authStore'
import { PageRequest } from '@/lib/request'
import { ActionPayload, PageResponse } from '@/lib/response'
import { TagForm } from '@/features/tags/components/tags-action-dialog'
import { TagInfo } from '@/features/tags/data/tag'

export type TagActionPayload = ActionPayload<number>

export const listTags = async (request: PageRequest) => {
  return fetchAuthed<PageResponse<TagInfo>>(
    `/tag/?page=${request.page}&limit=${request.limit}`
  )
}

export const listAllTags = async () => {
  return fetchAuthed<TagInfo[]>('/tag/all')
}

export const createTag = async (values: TagForm) => {
  return fetchAuthed<TagInfo>('/tag/', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export const updateTag = async (id: number, values: TagForm) => {
  return fetchAuthed<TagInfo>(`/tag/${id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  })
}

export const deleteTag = async (id: number) => {
  return fetchAuthed<TagInfo>(`/tag/${id}`, {
    method: 'DELETE',
  })
}

export const createOrUpdateTag = async (values: { id?: number } & TagForm) => {
  if (values.id) {
    return updateTag(values.id, values)
  } else {
    return createTag(values)
  }
}

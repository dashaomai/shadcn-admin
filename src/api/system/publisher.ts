import { fetchAuthed } from '@/stores/authStore'
import { PageRequest } from '@/lib/request'
import { ActionPayload, PageResponse } from '@/lib/response'
import { PublisherForm } from '@/features/publishers/components/publishers-action-dialog'
import { PublisherInfo } from '@/features/publishers/data/publisher'

export type PublisherActionPayload = ActionPayload<number>

export const listPublishers = async (request: PageRequest) => {
  return fetchAuthed<PageResponse<PublisherInfo>>(
    `/publisher/?page=${request.page}&limit=${request.limit}`
  )
}

export const listAllPublishers = async () => {
  return fetchAuthed<PublisherInfo[]>('/publisher/all')
}

export const createPublisher = async (values: PublisherForm) => {
  return fetchAuthed<PublisherInfo>('/publisher/', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export const updatePublisher = async (id: number, values: PublisherForm) => {
  return fetchAuthed<PublisherActionPayload>(`/publisher/${id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  })
}

export const createOrUpdatePublisher = async (
  values: { id?: number } & PublisherForm
) => {
  if (values.id) {
    return updatePublisher(values.id, {
      ...values,
      type: Number(values.type),
      status: Number(values.status),
    })
  } else {
    return createPublisher({
      ...values,
      type: Number(values.type),
      status: Number(values.status),
    })
  }
}

export const deletePublisher = async (id: number) => {
  return fetchAuthed<PublisherActionPayload>(`/publisher/${id}`, {
    method: 'DELETE',
  })
}

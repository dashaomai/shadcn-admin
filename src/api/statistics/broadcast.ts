import { fetchAuthed } from '@/stores/authStore.ts'
import { PageResponse } from '@/lib/response.ts'
import { Broadcast } from '@/features/broadcasts/data/broadcast.ts'

export type PageListBroadcastsRequest = {
  page: number
  limit: number
  begin: string
  end: string
  gameIds: number[]
  anchorIds: string[]
}

export const pageListBroadcasts = (params: PageListBroadcastsRequest) => {
  return fetchAuthed<PageResponse<Broadcast>>('/broadcasts/list', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export type ListBroadcastsRequest = {
  begin: string
  end: string
  gameIds: number[]
  anchorIds: string[]
}

export const listBroadcasts = (params: ListBroadcastsRequest) => {
  return fetchAuthed<Broadcast[]>('/broadcasts/list_all', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
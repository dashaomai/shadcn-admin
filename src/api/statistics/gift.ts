import { fetchAuthed } from '@/stores/authStore.ts'
import { PageResponse } from '@/lib/response.ts'
import { GiftRecord } from '@/features/gift-records/data/gift-record.ts'

export type PageListGiftRecordsRequest = {
  page: number
  limit: number
  begin: string
  end: string
  gameIds: number[]
  anchorIds: string[]
}

export const pageListGiftRecords = (params: PageListGiftRecordsRequest) => {
  return fetchAuthed<PageResponse<GiftRecord>>('/gift/list', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export type ListGiftRecordsRequest = {
  begin: string
  end: string
  gameIds: number[]
  anchorIds: string[]
}

export const listGiftRecords = (params: ListGiftRecordsRequest) => {
  return fetchAuthed<GiftRecord[]>('/gift/list_all', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
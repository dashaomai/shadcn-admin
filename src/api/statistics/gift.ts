import { fetchAuthed } from '@/stores/authStore.ts'
import { GiftRecord } from '@/features/gift-records/data/gift-record.ts'

export type PageListGiftRecordsRequest = {
  page: number
  limit: number
  begin: string
  end: string
  gameIds: number[]
  anchorIds: string[]
}

export type PageListGiftRecordsResponse = {
  page: number
  limit: number
  total: number
  data: GiftRecord[]
  summaryBet: string
  totalBet: string
}

export const pageListGiftRecords = (params: PageListGiftRecordsRequest) => {
  return fetchAuthed<PageListGiftRecordsResponse>('/gift/list', {
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
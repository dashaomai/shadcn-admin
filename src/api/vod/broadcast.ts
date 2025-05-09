import { fetchAuthed } from '@/stores/authStore.ts'

export type BroadcastInfo = {
  id: number
  vendorId: number
  domainId: number
  sessionId: string
  status: number
  createdAt: string
  finishedAt: string
  expiredAt: string
  gameId: number
  tableId: number
  gameName: string
  tableName: string
}

export type CreateBroadcastRequest = {
  vendorName: string
  domain: string
  gameId: number
  gameName: string
  tableId: number
  tableName: string
  expiredAt: string
}

export const getBroadcast = async () => {
  return fetchAuthed<BroadcastInfo>('/broadcast/')
}

export const createBroadcast = async (
  data: CreateBroadcastRequest
): Promise<BroadcastInfo | undefined> => {
  return fetchAuthed<BroadcastInfo>('/broadcast/', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const finishBroadcast = async () => {
  return fetchAuthed<string>('/broadcast/', {
    method: 'POST',
  })
}

export type GenerateUrlRequest = {
  gameName: string
  tableName: string
}

export type GenerateUrlResponse = {
  push: string
  pull: string
}

export const generateUrl = async (gameName: string, tableName: string) => {
  const request: GenerateUrlRequest = {
    gameName,
    tableName,
  }

  return fetchAuthed<GenerateUrlResponse>('/broadcast/url', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
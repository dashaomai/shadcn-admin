import { fetchAuthed } from '@/stores/authStore.ts'
import { PageRequest } from '@/lib/request.ts'

export type TablePageRequest = { gameId: number } & PageRequest

export const listTables = async (request: TablePageRequest) => {
  return fetchAuthed<TablePageRequest>(
    `/table/?gameId=${request.gameId}&page=${request.page}&limit=${request.limit}`
  )
}
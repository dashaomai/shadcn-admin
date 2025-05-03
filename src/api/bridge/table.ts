import { fetchAuthed } from '@/stores/authStore.ts'
import { PageRequest } from '@/lib/request.ts'
import { PageResponse } from '@/lib/response.ts'
import { TableInfo } from '@/features/tables/data/table.ts'

export type TablePageRequest = { gameId: number } & PageRequest

export const listTables = async (request: TablePageRequest) => {
  return fetchAuthed<PageResponse<TableInfo>>(
    `/table/?gameId=${request.gameId}&page=${request.page}&limit=${request.limit}`
  )
}
import { useQuery } from '@tanstack/react-query'
import { fetchAuthed } from '@/stores/authStore'
import { PageRequest } from '@/lib/request'
import { ActionPayload, PageResponse } from '@/lib/response'
import { OperationInfo } from '@/features/operations/data/operation'

export type OperationActionPayload = ActionPayload<string>

export const listOperations = async (request: PageRequest) =>
  fetchAuthed<PageResponse<OperationInfo>>(
    `/operation/?page=${request.page}&limit=${request.limit}`
  )

export const useOperations = (page: number, limit: number) =>
  useQuery({
    queryKey: ['operations-list', page, limit],
    queryFn: async () => listOperations({ page, limit }),
  })

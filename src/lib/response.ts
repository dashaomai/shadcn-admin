import { PageRequest } from '@/lib/request.ts'

export interface WrappedResponse<T> {
  code: number
  payload: T
}

export interface PageResponse<T> extends PageRequest {
  total: number
  data: T[]
}

/** Create, Update or Delete result payload */
export interface ActionPayload<T> {
  id: T
}

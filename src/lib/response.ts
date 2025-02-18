import { PageRequest } from '@/lib/request.ts'

export interface WrappedResponse<T> {
  code: number
  payload: T
}

export interface PageResponse<T> extends PageRequest {
  total: number
  data: T[]
}
import { useQuery } from '@tanstack/react-query'
import { ListRequest } from '@/api/statistics/summary.ts'
import { fetchAuthed } from '@/stores/authStore.ts'

export type AnchorStatInfo = {
  id: string
  nickname: string
  email: string
  avatar: string
  broadcastAmount: number
  broadcastDuration: number
}

export const listAnchorStat = (param: ListRequest) => {
  const sp = new URLSearchParams()
  sp.set('begin', param.begin)
  sp.set('end', param.end)
  sp.set('limit', String(param.limit))

  return fetchAuthed<AnchorStatInfo[]>(`/stats/anchors?${sp.toString()}`)
}

export const useTopAnchors = (param: ListRequest) =>
  useQuery({
    queryKey: ['top-anchors', param],
    queryFn: async () => listAnchorStat(param),
  })

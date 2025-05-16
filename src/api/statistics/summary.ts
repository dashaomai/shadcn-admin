import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { fetchAuthed } from '@/stores/authStore.ts'

export type DailySummary = {
  anchorAmount: number
  gameAmount: number
  broadcastAmount: number
  broadcastDuration: number
}

export type SummaryDate = 'today' | 'yesterday' | 'twodaysago'

export const getPrevDate = (data: SummaryDate): SummaryDate => {
  switch (data) {
    case 'today':
      return 'yesterday'
    case 'yesterday':
      return 'twodaysago'
    default:
      return 'twodaysago'
  }
}

const getRangeBySummary = (
  date: SummaryDate
): { begin: string; end: string } => {
  let begin: DateTime
  let end: DateTime

  switch (date) {
    case 'today': {
      end = DateTime.now()
      begin = end.startOf('day')

      break
    }

    case 'yesterday': {
      end = DateTime.now().startOf('day')
      begin = end.minus({ day: 1 })

      break
    }

    case 'twodaysago': {
      end = DateTime.now().startOf('day').minus({ days: 1 })
      begin = end.minus({ day: 1 })

      break
    }
  }

  return {
    begin: begin?.toISO() || '',
    end: end.toISO() || '',
  }
}

export const getDailySummary = async (date: SummaryDate) => {
  const range = getRangeBySummary(date)
  const sp = new URLSearchParams()
  sp.set('begin', range.begin)
  sp.set('end', range.end)
  return fetchAuthed<DailySummary>(`/stats/range?${sp.toString()}`)
}

export const useDailySummary = (date: SummaryDate) =>
  useQuery({
    queryKey: [`daily-summary-${date}`],
    queryFn: async () => getDailySummary(date),
  })

export type ListRequest = {
  begin: string
  end: string
  limit: number
}

export type SummaryStatInfo = {
  createdAt: string
  anchorAmount: number
  gameAmount: number
  broadcastAmount: number
  broadcastDuration: number
}

export const listHourlySummary = async (param: ListRequest) => {
  const sp = new URLSearchParams()
  sp.set('begin', param.begin)
  sp.set('end', param.end)
  sp.set('limit', String(param.limit))

  return fetchAuthed<SummaryStatInfo[]>(`/stats/summary?${sp.toString()}`)
}

export const useHourlySummary = (param: ListRequest) =>
  useQuery({
    queryKey: [`hourly-summary`, param],
    queryFn: async () => listHourlySummary(param),
  })

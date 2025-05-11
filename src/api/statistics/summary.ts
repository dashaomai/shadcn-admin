import { useQuery } from '@tanstack/react-query'
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

export const getDailySummary = async (date: SummaryDate) => {
  return fetchAuthed<DailySummary>(`/stats/${date}`)
}

export const useDailySummary = (date: SummaryDate) =>
  useQuery({
    queryKey: [`daily-summary-${date}`],
    queryFn: async () => getDailySummary(date),
  })
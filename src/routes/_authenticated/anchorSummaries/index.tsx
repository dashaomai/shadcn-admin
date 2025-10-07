import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { formatToDateOnly, getToday } from '@/utils/time.ts'
import { addDays } from 'date-fns'

const anchorSummariesListSchema = z.object({
  begin: z.string().default(formatToDateOnly(getToday())),
  end: z.string().default(formatToDateOnly(addDays(getToday(), 1))),
  page: z.number().default(1),
  limit: z.number().default(10),
})

export const Route = createFileRoute('/_authenticated/anchorSummaries/')({
  validateSearch: zodValidator(anchorSummariesListSchema),
})
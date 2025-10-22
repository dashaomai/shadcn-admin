import { z } from 'zod';
import { addDays } from 'date-fns';
import { createFileRoute } from '@tanstack/react-router'
import { formatToDateOnly, getToday } from '@/utils/time.ts'
import { zodValidator } from '@tanstack/zod-adapter'

const broadcastListSchema = z.object({
  begin: z.string().default(formatToDateOnly(getToday())),
  end: z.string().default(formatToDateOnly(addDays(getToday(), 1))),
  page: z.number().default(1),
  limit: z.number().default(10),
  games: z.array(z.number()).default([]),
  anchors: z.array(z.string()).default([]),
})

export const Route = createFileRoute('/_authenticated/broadcasts/')({
  validateSearch: zodValidator(broadcastListSchema),
})

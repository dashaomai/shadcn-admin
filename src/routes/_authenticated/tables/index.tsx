import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from '@/lib/i18n.ts'

const tableListSchema = z.object({
  gameId: z.number().default(1),
  page: z.number().default(1),
  limit: z.number().default(10),
})

export const Route = createFileRoute('/_authenticated/tables/')({
  validateSearch: zodValidator(tableListSchema),
})
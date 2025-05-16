import { z } from '@/lib/i18n'

export const GameTablesListSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
})
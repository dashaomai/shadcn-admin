import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from '@/lib/i18n'

const tagListSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
})

export const Route = createFileRoute('/_authenticated/tags/')({
  validateSearch: zodValidator(tagListSchema),
})

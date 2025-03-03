import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from '@/lib/i18n'

const platformsListSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
})

export const Route = createFileRoute('/_authenticated/platforms/')({
  validateSearch: zodValidator(platformsListSchema),
})

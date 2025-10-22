import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'

const anchorsListSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  anchors: z.array(z.string()).default([]),
  accountStatus: z.array(z.number()).default([]),
  specialStatus: z.array(z.number()).default([]),
})

export const Route = createFileRoute('/_authenticated/anchors/')({
  validateSearch: zodValidator(anchorsListSchema),
})

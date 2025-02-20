import { z } from '@/lib/i18n.ts'

const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
})
export type Role = z.infer<typeof roleSchema>

export const roleListSchema = z.array(roleSchema)
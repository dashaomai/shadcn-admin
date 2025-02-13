import { createFileRoute } from '@tanstack/react-router'
import { z } from '@/lib/i18n'

const signInSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in-2')({
  validateSearch: signInSearchSchema,
})

import { createFileRoute } from '@tanstack/react-router'
import { z } from '@/lib/i18n'
import SignIn2 from '@/features/auth/sign-in/sign-in-2'

const signInSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in-2')({
  validateSearch: signInSearchSchema,
  component: SignIn2,
})

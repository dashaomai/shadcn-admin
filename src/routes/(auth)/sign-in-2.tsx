import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const signInSearchSchema = z.object({
    redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in-2')({
    validateSearch: signInSearchSchema,
})

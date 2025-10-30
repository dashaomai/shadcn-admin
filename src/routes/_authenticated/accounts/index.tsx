import { z } from 'zod';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { getRoles } from '@/api/auth.ts'
import { gteAnchorManager, rolesCheck } from '@/lib/role.ts'


const accountsListSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
})

export const Route = createFileRoute('/_authenticated/accounts/')({
  validateSearch: zodValidator(accountsListSchema),
  beforeLoad: async (_options) => {
    const roles = await getRoles()
    if (!rolesCheck(roles, gteAnchorManager)) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

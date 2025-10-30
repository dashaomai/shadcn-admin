import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { getRoles } from '@/api/auth.ts';
import { z } from '@/lib/i18n';
import { gteAdmin, rolesCheck } from '@/lib/role.ts'


const tableListSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
})

export const Route = createFileRoute('/_authenticated/operations/')({
  validateSearch: zodValidator(tableListSchema),
  beforeLoad: async (_options) => {
    const roles = await getRoles()
    if (!rolesCheck(roles, gteAdmin)) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

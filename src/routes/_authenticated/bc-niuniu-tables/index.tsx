import { createFileRoute, redirect } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter';
import { getRoles } from '@/api/auth.ts';
import { eqAnchor, rolesCheck } from '@/lib/role.ts';
import { GameTablesListSchema } from '@/features/tables/data/schema';


export const Route = createFileRoute('/_authenticated/bc-niuniu-tables/')({
  validateSearch: zodValidator(GameTablesListSchema),
  beforeLoad: async (_options) => {
    const roles = await getRoles()
    if (!rolesCheck(roles, eqAnchor)) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

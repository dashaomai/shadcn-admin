import { getRoles } from '@/api/auth'
import { GameTablesListSchema } from '@/features/tables/data/schema'
import { eqAnchor, rolesCheck } from '@/lib/role'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'

export const Route = createFileRoute(
  '/_authenticated/bc-pushdot-q-sqz-tables/',
)({
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

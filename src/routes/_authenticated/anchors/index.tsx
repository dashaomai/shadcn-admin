import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { getRoles } from '@/api/auth.ts'
import { gteAnchorManager, rolesCheck } from '@/lib/role.ts'

const anchorsListSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  anchors: z.array(z.string()).default([]),
  accountStatus: z.array(z.number()).default([]),
  specialStatus: z.array(z.number()).default([]),
})

export const Route = createFileRoute('/_authenticated/anchors/')({
  validateSearch: zodValidator(anchorsListSchema),
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

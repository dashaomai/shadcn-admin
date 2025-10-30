import { z } from 'zod';
import { addDays } from 'date-fns'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter';
import { getRoles } from '@/api/auth.ts';
import { gteAnchorManager, rolesCheck } from '@/lib/role.ts';
import { formatToDateOnly, getToday } from '@/utils/time.ts';


const giftRecordsListSchema = z.object({
  begin: z.string().default(formatToDateOnly(getToday())),
  end: z.string().default(formatToDateOnly(addDays(getToday(), 1))),
  page: z.number().default(1),
  limit: z.number().default(50),
  games: z.array(z.number()).default([]),
  anchors: z.array(z.string()).default([]),
})

export const Route = createFileRoute('/_authenticated/giftRecords/')({
  validateSearch: zodValidator(giftRecordsListSchema),
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

import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { GameTablesListSchema } from '@/features/tables/data/schema'

export const Route = createFileRoute('/_authenticated/bc-baccarat-sqz-tables/')({
  validateSearch: zodValidator(GameTablesListSchema),
})

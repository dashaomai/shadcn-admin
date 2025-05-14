import { createLazyFileRoute } from '@tanstack/react-router'
import TablesPage from '@/features/tables'

export const Route = createLazyFileRoute('/_authenticated/tables/')({
  component: TablesPage,
})

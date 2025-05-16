import { createLazyFileRoute } from '@tanstack/react-router'
import TablesPage from '@/features/tables'

export const Route = createLazyFileRoute('/_authenticated/bc-niuniu-tables/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TablesPage gameId={2} path="/_authenticated/bc-niuniu-tables/" />
}

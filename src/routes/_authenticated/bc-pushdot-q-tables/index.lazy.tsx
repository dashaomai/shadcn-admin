import TablesPage from '@/features/tables'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/bc-pushdot-q-tables/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <TablesPage gameId={7} path='/_authenticated/bc-pushdot-q-tables/' />
}

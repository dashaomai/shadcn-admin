import TablesPage from '@/features/tables'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/bc-pushdot-q-sqz-tables/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  <TablesPage gameId={107} path='/_authenticated/bc-pushdot-q-sqz-tables/' />
}

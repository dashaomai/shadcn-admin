import { createLazyFileRoute } from '@tanstack/react-router'
import TablesPage from '@/features/tables'

export const Route = createLazyFileRoute('/_authenticated/bc-pushdots-tables/')(
  {
    component: RouteComponent,
  }
)

function RouteComponent() {
  return <TablesPage gameId={3} path='/_authenticated/bc-pushdots-tables/' />
}

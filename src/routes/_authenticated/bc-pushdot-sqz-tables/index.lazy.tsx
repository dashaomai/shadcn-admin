import { createLazyFileRoute } from '@tanstack/react-router'
import TablesPage from '@/features/tables'

export const Route = createLazyFileRoute('/_authenticated/bc-pushdot-sqz-tables/')(
  {
    component: RouteComponent,
  }
)

function RouteComponent() {
  return <TablesPage gameId={103} path='/_authenticated/bc-pushdot-sqz-tables/' />
}

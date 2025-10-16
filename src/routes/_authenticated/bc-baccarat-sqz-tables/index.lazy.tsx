import { createLazyFileRoute } from '@tanstack/react-router'
import TablesPage from '@/features/tables'

export const Route = createLazyFileRoute('/_authenticated/bc-baccarat-sqz-tables/')(
  {
    component: RouteComponent,
  }
)

function RouteComponent() {
  return <TablesPage gameId={101} path='/_authenticated/bc-baccarat-sqz-tables/' />
}

import { createLazyFileRoute } from '@tanstack/react-router'
import TablesPage from '@/features/tables'

export const Route = createLazyFileRoute('/_authenticated/bc-baccarat-tables/')(
  {
    component: RouteComponent,
  }
)

function RouteComponent() {
  return <TablesPage gameId={1} path='/_authenticated/bc-baccarat-tables/' />
}

import TablesPage from '@/features/tables'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/e-baccarat-tables/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TablesPage gameId={201} path='/_authenticated/e-baccarat-tables/' />
}

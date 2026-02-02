import { createLazyFileRoute } from '@tanstack/react-router'
import TablesPage from '@/features/tables'

export const Route = createLazyFileRoute('/_authenticated/bc-tiengow-f-sqz-tables/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TablesPage gameId={105} path="/_authenticated/bc-tiengow-f-sqz-tables/" />
}

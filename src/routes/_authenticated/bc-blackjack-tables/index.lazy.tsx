import TablesPage from '@/features/tables'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/bc-blackjack-tables/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <TablesPage gameId={8} path='/_authenticated/bc-blackjack-tables/' />
}

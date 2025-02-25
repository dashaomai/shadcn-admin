import { createLazyFileRoute } from '@tanstack/react-router'
import AccountsPage from '@/features/accounts'

export const Route = createLazyFileRoute('/_authenticated/accounts/')({
  component: AccountsPage,
})

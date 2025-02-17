import { createLazyFileRoute } from '@tanstack/react-router'
import RolesPage from '@/features/roles'

export const Route = createLazyFileRoute('/_authenticated/roles/')({
  component: RolesPage,
})
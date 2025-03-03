import { createLazyFileRoute } from '@tanstack/react-router'
import DevelopersPage from '@/features/developers'

export const Route = createLazyFileRoute('/_authenticated/developers/')({
  component: DevelopersPage,
})

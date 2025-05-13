import { createLazyFileRoute } from '@tanstack/react-router'
import OperationsPage from '@/features/operations'

export const Route = createLazyFileRoute('/_authenticated/operations/')({
  component: OperationsPage,
})

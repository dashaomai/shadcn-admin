import { createLazyFileRoute } from '@tanstack/react-router'
import PublishersPage from '@/features/publishers'

export const Route = createLazyFileRoute('/_authenticated/publishers/')({
  component: PublishersPage,
})

import { createLazyFileRoute } from '@tanstack/react-router'
import BroadcastsPage from '@/features/broadcasts'

export const Route = createLazyFileRoute('/_authenticated/broadcasts/')({
  component: BroadcastsPage,
})
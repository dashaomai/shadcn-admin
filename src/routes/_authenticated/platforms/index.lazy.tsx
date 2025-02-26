import { createLazyFileRoute } from '@tanstack/react-router'
import PlatformsPage from '@/features/platforms'

export const Route = createLazyFileRoute('/_authenticated/platforms/')({
  component: PlatformsPage,
})

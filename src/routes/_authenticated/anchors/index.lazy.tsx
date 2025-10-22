import { createLazyFileRoute } from '@tanstack/react-router'
import AnchorsPage from '@/features/anchors'

export const Route = createLazyFileRoute('/_authenticated/anchors/')({
  component: AnchorsPage,
})
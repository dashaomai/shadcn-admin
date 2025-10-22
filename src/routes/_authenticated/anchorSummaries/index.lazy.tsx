import { createLazyFileRoute } from '@tanstack/react-router'
import AnchorSummariesPage from '@/features/anchor-summaries'

export const Route = createLazyFileRoute('/_authenticated/anchorSummaries/')({
  component: AnchorSummariesPage,
})
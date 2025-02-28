import { createLazyFileRoute } from '@tanstack/react-router'
import TagsPage from '@/features/tags'

export const Route = createLazyFileRoute('/_authenticated/tags/')({
  component: TagsPage,
})

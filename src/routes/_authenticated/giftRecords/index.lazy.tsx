import { createLazyFileRoute } from '@tanstack/react-router'
import GiftRecordsPage from '@/features/gift-records'

export const Route = createLazyFileRoute('/_authenticated/giftRecords/')({
  component: GiftRecordsPage,
})

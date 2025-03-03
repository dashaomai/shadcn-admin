import { useContext, useState } from 'react'
import {
  createContext,
  ListAppsDialogType,
  ListAppsProps,
} from '@/lib/list-app'
import useDialogState from '@/hooks/use-dialog-state'
import { PublisherInfo } from '../data/publisher'

const PublishersContext = createContext<ListAppsDialogType, PublisherInfo>()

export default function PublishersProvider({ children }: ListAppsProps) {
  const [open, setOpen] = useDialogState<ListAppsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<PublisherInfo | null>(null)

  return (
    <PublishersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PublishersContext>
  )
}

export const usePublishers = () => {
  const publisherContext = useContext(PublishersContext)

  if (!publisherContext) {
    throw new Error('usePublisher must be used within a <PublishersProvider>')
  }

  return publisherContext
}

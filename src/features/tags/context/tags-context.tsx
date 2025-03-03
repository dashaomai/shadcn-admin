import { useContext, useState } from 'react'
import {
  createContext,
  ListAppsDialogType,
  ListAppsProps,
} from '@/lib/list-app'
import useDialogState from '@/hooks/use-dialog-state'
import { TagInfo } from '../data/tag'

const TagsContext = createContext<ListAppsDialogType, TagInfo>()

export default function TagsProvider({ children }: ListAppsProps) {
  const [open, setOpen] = useDialogState<ListAppsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TagInfo | null>(null)

  return (
    <TagsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TagsContext>
  )
}

export const useTags = () => {
  const tagsContext = useContext(TagsContext)

  if (!tagsContext) {
    throw new Error('useTags must be used within a <TagsProvider>')
  }

  return tagsContext
}

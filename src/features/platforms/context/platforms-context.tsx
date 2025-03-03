import { useContext, useState } from 'react'
import {
  createContext,
  ListAppsDialogType,
  ListAppsProps,
} from '@/lib/list-app'
import useDialogState from '@/hooks/use-dialog-state'
import { PlatformInfo } from '../data/platform'

const PlatformsContext = createContext<ListAppsDialogType, PlatformInfo>()

export default function PlatformsProvider({ children }: ListAppsProps) {
  const [open, setOpen] = useDialogState<ListAppsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<PlatformInfo | null>(null)

  return (
    <PlatformsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PlatformsContext>
  )
}

export const usePlatforms = () => {
  const platformsContext = useContext(PlatformsContext)

  if (!platformsContext) {
    throw new Error(`usePlatforms must be used within <PlatformsContext>`)
  }

  return platformsContext
}

import { useContext, useState } from 'react'
import {
  createContext,
  ListAppsDialogType,
  ListAppsProps,
} from '@/lib/list-app'
import useDialogState from '@/hooks/use-dialog-state'
import { DeveloperInfo } from '../data/developer'

const DevelopersContext = createContext<ListAppsDialogType, DeveloperInfo>()

export default function DevelopersProvider({ children }: ListAppsProps) {
  const [open, setOpen] = useDialogState<ListAppsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<DeveloperInfo | null>(null)

  return (
    <DevelopersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DevelopersContext>
  )
}

export const useDevelopers = () => {
  const developersContext = useContext(DevelopersContext)

  if (!developersContext) {
    throw new Error('useDevelopers must be used within a <DevelopersProvider>')
  }

  return developersContext
}

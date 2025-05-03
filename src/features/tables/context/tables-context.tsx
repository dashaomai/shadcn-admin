import { useContext, useState } from 'react'
import {
  createContext,
  ListAppsDialogType,
  ListAppsProps,
} from '@/lib/list-app.ts'
import useDialogState from '@/hooks/use-dialog-state.tsx'
import { TableInfo } from '@/features/tables/data/table.ts'

const TablesContext = createContext<ListAppsDialogType, TableInfo>()

export default function TablesProvider({ children }: ListAppsProps) {
  const [open, setOpen] = useDialogState<ListAppsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TableInfo | null>(null)

  return (
    <TablesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TablesContext>
  )
}

export const useTables = () => {
  const tableContext = useContext(TablesContext)

  if (!tableContext) {
    throw new Error('useTables must be used within a <TablesProvider>')
  }

  return tableContext
}
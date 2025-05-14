import { useContext, useState } from 'react'
import {
  createContext,
  ListAppsDialogType,
  ListAppsProps,
} from '@/lib/list-app'
import useDialogState from '@/hooks/use-dialog-state'
import { OperationInfo } from '../data/operation'

const OperationsContext = createContext<ListAppsDialogType, OperationInfo>()

export default function OperationsProvider({ children }: ListAppsProps) {
  const [open, setOpen] = useDialogState<ListAppsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<OperationInfo | null>(null)

  return (
    <OperationsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </OperationsContext>
  )
}

export const useOperations = () => {
  const operationContext = useContext(OperationsContext)

  if (!operationContext) {
    throw new Error('useOperations must be used within a <OperationsProvider>')
  }

  return operationContext
}

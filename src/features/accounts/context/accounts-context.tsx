import { createContext, ListAppsProps } from '@/lib/list-app.ts'
import { AccountInfo } from '@/features/accounts/data/account-info.ts'
import useDialogState from '@/hooks/use-dialog-state.tsx'
import { useContext, useState } from 'react'


type AccountsAppsDialogType = 'create' | 'update' | 'update-roles' | 'reset-password'

const AccountsContext = createContext<AccountsAppsDialogType, AccountInfo>()

export default function AccountsProvider({ children }: ListAppsProps) {
  const [open, setOpen] = useDialogState<AccountsAppsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AccountInfo | null>(null)

  return (
    <AccountsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </AccountsContext>
  )
}

export const useAccounts = () => {
  const accountsContext = useContext(AccountsContext)

  if (!accountsContext) {
    throw new Error(`useAccounts must be used within <AccountsContext>`)
  }

  return accountsContext
}
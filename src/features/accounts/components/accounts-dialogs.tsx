import { useAccounts } from '../context/accounts-context'
import { useEffect } from 'react'
import { AccountsActionDialog } from './accounts-action-dialog'


export function AccountsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAccounts()

  useEffect(() => {
    if (!open && setCurrentRow) {
      setCurrentRow(null)
    }
  }, [open, setCurrentRow])

  return (
    <>
      <AccountsActionDialog
        key='account-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <AccountsActionDialog
            key={`account-update${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => setOpen('update')}
            currentRow={currentRow}
          />
        </>
      )}
    
    </>
  )
}
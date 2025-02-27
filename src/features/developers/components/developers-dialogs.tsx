import { useEffect } from 'react'
import { useDevelopers } from '../context/developers-context'
import { DevelopersActionDialog } from './developers-action-dialog'

export function DevelopersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDevelopers()

  useEffect(() => {
    if (!open && setCurrentRow) {
      setCurrentRow(null)
    }
  }, [open, setCurrentRow])

  return (
    <>
      <DevelopersActionDialog
        key='developer-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <DevelopersActionDialog
            key={`developer-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => setOpen('update')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}

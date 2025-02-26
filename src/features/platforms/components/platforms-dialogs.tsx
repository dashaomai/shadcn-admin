import { useEffect } from 'react'
import { usePlatforms } from '../context/platforms-context'
import { PlatformsActionDialog } from './platforms-action-dialog'

export function PlatformsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePlatforms()

  useEffect(() => {
    if (!open && setCurrentRow) {
      setCurrentRow(null)
    }
  }, [open, setCurrentRow])

  return (
    <>
      <PlatformsActionDialog
        key='platform-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <PlatformsActionDialog
            key={`platform-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => setOpen('update')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}

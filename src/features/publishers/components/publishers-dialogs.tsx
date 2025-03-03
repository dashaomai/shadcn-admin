import { useEffect } from 'react'
import { usePublishers } from '../context/publisher-context'
import { PublishersActionDialog } from './publishers-action-dialog'

export function PublishersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePublishers()

  useEffect(() => {
    if (!open && setCurrentRow) {
      setCurrentRow(null)
    }
  }, [open, setCurrentRow])

  return (
    <>
      <PublishersActionDialog
        key='publisher-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <PublishersActionDialog
            key={`publisher-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => setOpen('update')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}

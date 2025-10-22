import { useAnchors } from '@/features/anchors/context/anchors-context.tsx'
import { useEffect } from 'react'
import { AnchorsActionDialog } from '@/features/anchors/components/anchors-action-dialog.tsx'

export function AnchorsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAnchors()

  useEffect(() => {
    if (!open && setCurrentRow) {
      setCurrentRow(null)
    }
  }, [open, setCurrentRow])

  return (
    <>
      {currentRow && (
        <AnchorsActionDialog
          key={`anchors-update${currentRow.id}`}
          open={open === 'update'}
          onOpenChange={() => setOpen('update')}
          currentRow={currentRow}
        />
      )}
    </>
  )
}
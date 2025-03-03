import { useEffect } from 'react'
import { useTags } from '@/features/tags/context/tags-context'
import { TagsActionDialog } from './tags-action-dialog'

export function TagsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTags()

  useEffect(() => {
    if (!open && setCurrentRow) {
      setCurrentRow(null)
    }
  }, [open, setCurrentRow])

  return (
    <>
      <TagsActionDialog
        key='tag-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <TagsActionDialog
            key={`tag-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => setOpen('update')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}

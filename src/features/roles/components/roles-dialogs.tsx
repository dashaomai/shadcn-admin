import { useEffect } from 'react'
import { RolesActionDialog } from '@/features/roles/components/roles-action-dialog.tsx'
import { RolesDeleteDialog } from '@/features/roles/components/roles-delete-dialog.tsx'
import { useRoles } from '@/features/roles/context/roles-context.tsx'

export function RolesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRoles()

  useEffect(() => {
    if (!open && setCurrentRow) {
      setCurrentRow(null)
    }
  }, [open, setCurrentRow])

  return (
    <>
      <RolesActionDialog
        key='role-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <RolesActionDialog
            key={`role-update${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => setOpen('update')}
            currentRow={currentRow}
          />

          <RolesDeleteDialog
            key='role-delete'
            currentRow={currentRow}
            open={open === 'delete'}
            onOpenChange={() => setOpen('delete')}
          />
        </>
      )}
    </>
  )
}
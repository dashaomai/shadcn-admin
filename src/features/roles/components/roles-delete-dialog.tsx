import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { IconAlertTriangle } from '@tabler/icons-react'
import { deleteRole } from '@/api/auth.ts'
import { ListAppsDeleteDialogProps } from '@/lib/list-app.ts'
import { Role } from '@/lib/role.ts'
import { toast } from '@/hooks/use-toast.ts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { ConfirmDialog } from '@/components/confirm-dialog.tsx'

export function RolesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ListAppsDeleteDialogProps<Role>) {
  const queryClient = useQueryClient()

  const api = getRouteApi('/_authenticated/roles/')
  const { page, limit } = api.useSearch()

  const mutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: async (payload) => {
      if (payload?.id === currentRow.id) {
        onOpenChange(false)
        queryClient
          .invalidateQueries({
            queryKey: ['roles-list', page, limit],
          })
          .then()
        toast({
          title: 'The role has been deleted.',
        })
      }
    },
  })

  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() === currentRow.name) {
      mutation.mutate(currentRow.id)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete Role
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove the role of{' '}
            <span className='font-bold'>{currentRow.description}</span> from the
            system. This cannot be undone.
          </p>

          <Label className='my-2'>
            Name:
            <Input
              value={value}
              disabled={mutation.isPending}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter name to confirm deletion.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
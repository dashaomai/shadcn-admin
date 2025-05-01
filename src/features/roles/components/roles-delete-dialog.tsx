import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { IconAlertTriangle } from '@tabler/icons-react'
import { deleteRole } from '@/api/auth.ts'
import { i18n } from '@/lib/i18n.ts'
import { ListAppsDeleteDialogProps } from '@/lib/list-app.ts'
import { Role } from '@/lib/role.ts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { ConfirmDialog } from '@/components/confirm-dialog.tsx'
import { toast } from 'sonner'

export function RolesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ListAppsDeleteDialogProps<Role>) {
  const queryClient = useQueryClient()

  const api = getRouteApi('/_authenticated/roles/')
  const { page, limit } = api.useSearch()

  const name = currentRow.name

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
        toast.success(i18n.t('apps.roles.toast.delete.title'), {
          description: i18n.t('apps.roles.toast.delete.ed', { name }),
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
      cancelBtnText={i18n.t('layout.dialog.cancel')}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {i18n.t('apps.roles.toast.delete.title')}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {i18n.t('apps.roles.delete.confirm0')}
            <span className='font-bold'>{currentRow.name}</span>
            {i18n.t('apps.roles.delete.confirm1')}
            <br />
            {i18n.t('apps.roles.delete.confirm2')}
            <span className='font-bold'>{currentRow.description}</span>
            {i18n.t('apps.roles.delete.confirm3')}
          </p>

          <Label className='my-2'>
            {i18n.t('apps.roles.properties.name.title')}:
            <Input
              value={value}
              disabled={mutation.isPending}
              onChange={(e) => setValue(e.target.value)}
              placeholder={i18n.t('apps.roles.delete.placeholder')}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{i18n.t('apps.roles.delete.warning')}</AlertTitle>
            <AlertDescription>
              {i18n.t('apps.roles.delete.careful')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={i18n.t('apps.roles.delete.submit')}
      destructive
    />
  )
}
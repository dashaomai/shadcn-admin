import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { IconAlertTriangle } from '@tabler/icons-react'
import { deleteRole } from '@/api/auth.ts'
import { ListAppsDeleteDialogProps } from '@/lib/list-app.ts'
import { Role } from '@/lib/role.ts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { ConfirmDialog } from '@/components/confirm-dialog.tsx'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export function RolesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ListAppsDeleteDialogProps<Role>) {
  const { t } = useTranslation()
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
        toast.success(t('apps.roles.toast.delete.title'), {
          description: t('apps.roles.toast.delete.ed', { name }),
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
      cancelBtnText={t('layout.dialog.cancel')}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('apps.roles.toast.delete.title')}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t('apps.roles.delete.confirm0')}
            <span className='font-bold'>{currentRow.name}</span>
            {t('apps.roles.delete.confirm1')}
            <br />
            {t('apps.roles.delete.confirm2')}
            <span className='font-bold'>{currentRow.description}</span>
            {t('apps.roles.delete.confirm3')}
          </p>

          <Label className='my-2'>
            {t('apps.roles.properties.name.title')}:
            <Input
              value={value}
              disabled={mutation.isPending}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('apps.roles.delete.placeholder')}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t('apps.roles.delete.warning')}</AlertTitle>
            <AlertDescription>
              {t('apps.roles.delete.careful')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('apps.roles.delete.submit')}
      destructive
    />
  )
}
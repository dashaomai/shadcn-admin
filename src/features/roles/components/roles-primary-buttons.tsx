import { IconPasswordUser } from '@tabler/icons-react'
import { Button } from '@/components/ui/button.tsx'
import { useRoles } from '@/features/roles/context/roles-context.tsx'
import { useTranslation } from 'react-i18next'

export function RolesPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useRoles()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t('apps.roles.button.create')}</span>{' '}
        <IconPasswordUser size={18} />
      </Button>
    </div>
  )
}
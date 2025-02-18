import { IconPasswordUser } from '@tabler/icons-react'
import { i18n } from '@/lib/i18n.ts'
import { Button } from '@/components/ui/button.tsx'
import { useRoles } from '@/features/roles/context/roles-context.tsx'

export function RolesPrimaryButtons() {
  const { setOpen } = useRoles()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{i18n.t('apps.roles.button.create')}</span>{' '}
        <IconPasswordUser size={18} />
      </Button>
    </div>
  )
}
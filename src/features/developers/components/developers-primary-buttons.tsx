import { IconPlus } from '@tabler/icons-react'
import { i18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { useDevelopers } from '../context/developers-context'

export function DevelopersPrimaryButtons() {
  const { setOpen } = useDevelopers()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{i18n.t('apps.developers.create.title')}</span>
        <IconPlus size={18} />
      </Button>
    </div>
  )
}

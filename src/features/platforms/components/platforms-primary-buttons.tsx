import { IconPlus } from '@tabler/icons-react'
import { i18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { usePlatforms } from '../context/platforms-context'

export function PlatformsPrimaryButtons() {
  const { setOpen } = usePlatforms()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{i18n.t('apps.platforms.create.title')}</span>
        <IconPlus size={18} />
      </Button>
    </div>
  )
}

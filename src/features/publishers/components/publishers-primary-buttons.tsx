import { IconPlus } from '@tabler/icons-react'
import { i18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { usePublishers } from '../context/publisher-context'

export function PublishersPrimaryButtons() {
  const { setOpen } = usePublishers()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{i18n.t('apps.publishers.create.title')}</span>
        <IconPlus size={18} />
      </Button>
    </div>
  )
}

import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { usePublishers } from '../context/publisher-context'
import { useTranslation } from 'react-i18next'

export function PublishersPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = usePublishers()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t('apps.publishers.create.title')}</span>
        <IconPlus size={18} />
      </Button>
    </div>
  )
}

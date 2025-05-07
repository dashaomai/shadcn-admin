import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { usePlatforms } from '../context/platforms-context'
import { useTranslation } from 'react-i18next'

export function PlatformsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = usePlatforms()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t('apps.platforms.create.title')}</span>
        <IconPlus size={18} />
      </Button>
    </div>
  )
}

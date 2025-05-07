import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useTags } from '../context/tags-context'
import { useTranslation } from 'react-i18next'

export function TagsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useTags()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t('apps.tags.create.title')}</span>
        <IconPlus size={18} />
      </Button>
    </div>
  )
}

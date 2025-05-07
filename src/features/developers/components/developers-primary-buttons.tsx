import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useDevelopers } from '../context/developers-context'
import { useTranslation } from 'react-i18next'

export function DevelopersPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useDevelopers()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t('apps.developers.create.title')}</span>
        <IconPlus size={18} />
      </Button>
    </div>
  )
}

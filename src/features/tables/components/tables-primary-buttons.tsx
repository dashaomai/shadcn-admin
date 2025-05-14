import { IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.tsx'
import { useTables } from '../context/tables-context'

export function TablesPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useTables()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t('apps.tables.create.title')}</span>
        <IconPlus size={18} />
      </Button>
    </div>
  )
}

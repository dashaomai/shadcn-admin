import { IconPlus } from '@tabler/icons-react'
import { i18n } from '@/lib/i18n.ts'
import { Button } from '@/components/ui/button.tsx'
import { useTables } from '../context/tables-context'

export function TablesPrimaryButtons() {
  const { setOpen } = useTables()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{i18n.t('apps.game-catalogs.create.title')}</span>
        <IconPlus size={18} />
      </Button>
    </div>
  )
}
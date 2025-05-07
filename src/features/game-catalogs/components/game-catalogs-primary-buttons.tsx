import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useGameCatalogs } from '../context/game-catalogs-context'
import { useTranslation } from 'react-i18next'

export function GameCatalogsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useGameCatalogs()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t('apps.game-catalogs.create.title')}</span>
        <IconPlus size={18} />
      </Button>
    </div>
  )
}

import { IconPlus } from '@tabler/icons-react'
import { i18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { useTags } from '../context/tags-context'

export function TagsPrimaryButtons() {
  const { setOpen } = useTags()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{i18n.t('apps.tags.create.title')}</span>
        <IconPlus size={18} />
      </Button>
    </div>
  )
}

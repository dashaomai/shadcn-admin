import { Link } from '@tanstack/react-router';
import { SearchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.tsx'
import { useAnchorFilter } from '@/components/context/anchor-filter-context.tsx'
import { Route } from '@/routes/_authenticated/anchors'


export function AnchorsPrimaryButtons() {
  const { t } = useTranslation()

  const { values: anchors } = useAnchorFilter()

  return (
    <div className='flex gap-2'>
      <Link
        className='space-x-1'
        from={Route.fullPath}
        search={prev => ({...prev, anchors})}
      >
        <Button>
          <span>{t('common.query')}</span>
          <SearchIcon />
        </Button>
      </Link>
    </div>
  )
}
import { Link } from '@tanstack/react-router';
import { SearchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.tsx'
import { useAnchorFilter } from '@/components/context/anchor-filter-context.tsx'
import { Route } from '@/routes/_authenticated/anchors'
import { useAccountStatusFilter } from '@/components/context/account-status-filter-context.tsx'
import { useSpecialStatusFilter } from '@/components/context/special-status-filter-context.tsx'


export function AnchorsPrimaryButtons() {
  const { t } = useTranslation()

  const { values: anchors } = useAnchorFilter()
  const { values: accountStatus } = useAccountStatusFilter()
  const { values: specialStatus } = useSpecialStatusFilter()

  return (
    <div className='flex gap-2'>
      <Link
        className='space-x-1'
        from={Route.fullPath}
        search={prev => ({...prev, anchors, accountStatus, specialStatus})}
      >
        <Button>
          <span>{t('common.query')}</span>
          <SearchIcon />
        </Button>
      </Link>
    </div>
  )
}
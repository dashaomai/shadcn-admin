import { DownloadIcon, SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.tsx'
import { Link } from '@tanstack/react-router'
import { useRangeDate } from '@/components/context/range-date-context.tsx'
import { useGameFilter } from '@/components/context/game-filter-context.tsx'
import { useAnchorFilter } from '@/components/context/anchor-filter-context.tsx'
import { Route } from '@/routes/_authenticated/anchorSummaries'
import { formatToDateOnly } from '@/utils/time.ts'

export function AnchorSummariesPrimaryButtons() {
  const { t } = useTranslation()

  const {begin, end} = useRangeDate()
  const {values: games} = useGameFilter()
  const {values: anchors} = useAnchorFilter()

  return (
    <div className='flex gap-2'>
      <Link
        className='space-x-1'
        from={Route.fullPath}
        search={prev => ({...prev, begin: formatToDateOnly(begin), end: formatToDateOnly(end), games, anchors})}
      >
        <Button>
          <span>{t('common.query')}</span>
          <SearchIcon />
        </Button>
      </Link>

      <Button className='space-x-1' onClick={(e) => e.preventDefault()}>
        <span>{t('common.export')}</span>
        <DownloadIcon />
      </Button>
    </div>
  )
}
import { useTranslation } from 'react-i18next'
import { useAllGames } from '@/api/bridge/game.ts'
import { useAllAnchors } from '@/api/bridge/anchor.ts'
import { useRangeDate } from '@/components/context/range-date-context.tsx'
import { useGameFilter } from '@/components/context/game-filter-context.tsx'
import { useAnchorFilter } from '@/components/context/anchor-filter-context.tsx'
import { formatToDateOnly } from '@/utils/time.ts'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'
import { DownloadIcon, SearchIcon } from 'lucide-react'
import { Route } from '@/routes/_authenticated/giftRecords'

export function GiftRecordsPrimaryButtons() {
  const { t } = useTranslation()

  const allGames = useAllGames()
  const allAnchors = useAllAnchors()

  const {begin, end} = useRangeDate()
  const {values: games} = useGameFilter()
  const {values: anchors} = useAnchorFilter()

  const be = formatToDateOnly(begin)
  const en = formatToDateOnly(end)

  const downloadRecords = async () => {
    console.log(allGames, allAnchors)
  }

  return (
    <div className='flex gap-2'>
      <Link
        className='space-x-1'
        from={Route.fullPath}
        search={prev => ({...prev, begin: be, end: en, games, anchors})}
      >
        <Button>
          <span>{t('common.query')}</span>
        <SearchIcon />
        </Button>
      </Link>

      <Button className='space-x-1' onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        downloadRecords().then()
      }}>
        <span>{t('common.export')}</span>
        <DownloadIcon />
      </Button>
    </div>
  )
}
import { DownloadIcon, SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.tsx'
import { Link } from '@tanstack/react-router'
import { useRangeDate } from '@/components/context/range-date-context.tsx'
import { useGameFilter } from '@/components/context/game-filter-context.tsx'
import { useAnchorFilter } from '@/components/context/anchor-filter-context.tsx'
import { Route } from '@/routes/_authenticated/anchorSummaries'
import { formatToDate, formatToDateOnly, translateSeconds } from '@/utils/time.ts'
import { listAnchorSummaries } from '@/api/statistics/anchor.ts'
import { formatRFC3339 } from 'date-fns'
import * as XLSX from 'xlsx'
import { useAllGames } from '@/api/bridge/game.ts'
import { useAllAnchors } from '@/api/bridge/anchor.ts'
import { AnchorSummaryRow, BroadcastStatus } from '@/features/anchor-summaries/data/anchor-summary.ts'
import { currencyToString } from '@/utils/currency.ts'

export function AnchorSummariesPrimaryButtons() {
  const { t } = useTranslation()

  const allGames = useAllGames()
  const allAnchors = useAllAnchors()

  const {begin, end} = useRangeDate()
  const {values: games} = useGameFilter()
  const {values: anchors} = useAnchorFilter()

  const be = formatToDateOnly(begin)
  const en = formatToDateOnly(end)

  const downloadStatistics = async () => {
    const data = await listAnchorSummaries({
      begin: formatRFC3339(begin),
      end: formatRFC3339(end),
      gameIds: games,
      anchorIds: anchors,
    })

    if (allGames.isFetched && allAnchors.isFetched && data !== undefined) {
      const rows = data.map<AnchorSummaryRow>(d => {
        const b = formatToDate(d.lastBegin)
        const e = d.broadcastStatus === BroadcastStatus.Finished ? formatToDate(d.lastEnd) : ''

        const game = allGames.data?.find(g => g.id === d.lastGameId)

        return {
          anchor: allAnchors.data?.find(info => info.id === d.anchorId)?.nickname ?? 'unknown',
          status: t(`common.broadcast.status.${d.broadcastStatus}`),
          lastTime: `${b} - ${e}`,
          lastGame: game ? t(`apps.games.name.${game?.name}`) : 'unknown',
          broadcastCount: d.broadcastCount,
          broadcastDuration: translateSeconds(d.broadcastDuration, t),
          giftCount: d.giftCount,
          giftValue: currencyToString(d.giftValue),
        }
      })

      const title = t('layout.navigate.items.summaries')

      const worksheet = XLSX.utils.json_to_sheet(rows)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, title)

      XLSX.writeFile(workbook, `${title}.xlsx`)
    }
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
        downloadStatistics().then()
      }}>
        <span>{t('common.export')}</span>
        <DownloadIcon />
      </Button>
    </div>
  )
}
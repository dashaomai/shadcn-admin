import { formatRFC3339 } from 'date-fns';
import { Link } from '@tanstack/react-router';
import { Route } from '@/routes/_authenticated/broadcasts';
import { DownloadIcon, SearchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { useAllAnchors } from '@/api/bridge/anchor.ts';
import { useAllGames } from '@/api/bridge/game.ts';
import { listBroadcasts } from '@/api/statistics/broadcast.ts';
import { BroadcastStatus } from '@/lib/broadcast.ts';
import { currencyToString } from '@/utils/currency.ts';
import { formatToDate, formatToDateOnly, translateSeconds } from '@/utils/time.ts';
import { Button } from '@/components/ui/button.tsx';
import { useAnchorFilter } from '@/components/context/anchor-filter-context.tsx';
import { useGameFilter } from '@/components/context/game-filter-context.tsx';
import { useRangeDate } from '@/components/context/range-date-context.tsx';
import { BroadcastRow } from '@/features/broadcasts/data/broadcast.ts';


export function BroadcastsPrimaryButtons() {
  const { t } = useTranslation()

  const allGames = useAllGames()
  const allAnchors = useAllAnchors()

  const {begin, end} = useRangeDate()
  const {values: games} = useGameFilter()
  const {values: anchors} = useAnchorFilter()

  const be = formatToDateOnly(begin)
  const en = formatToDateOnly(end)

  const downloadBroadcasts = async () => {
    const data = await listBroadcasts({
      begin: formatRFC3339(begin),
      end: formatRFC3339(end),
      gameIds: games,
      anchorIds: anchors,
    })

    if (allGames.isFetched && allAnchors.isFetched && data !== undefined) {
      const rows = data.map<BroadcastRow>((d) => {
        const b = formatToDate(d.begin)
        const e =
          d.status === BroadcastStatus.Finished ? formatToDate(d.end) : ''

        const duration =
          d.status === BroadcastStatus.Finished
            ? (new Date(d.end).getTime() - new Date(d.begin).getTime()) / 1000
            : 0

        const game = allGames.data?.find((g) => g.id === d.gameId)

        return {
          anchor:
            allAnchors.data?.find((info) => info.id === d.anchorId)?.nickname ??
            'unknown',
          time: `${b} - ${e}`,
          game: game ? t(`apps.games.name.${game?.name}`) : 'unknown',
          table: d.table,
          duration: translateSeconds(duration, t),
          giftCount: d.giftCount,
          giftValue: currencyToString(d.giftValue),
        }
      })

      const title = t('layout.navigate.items.broadcasts')

      const headers = [
        t('apps.broadcasts.properties.anchor.title'),
        t('apps.broadcasts.properties.broadcast.title'),
        t('apps.broadcasts.properties.game.title'),
        t('apps.broadcasts.properties.table.title'),
        t('apps.broadcasts.properties.duration.title'),
        t('apps.broadcasts.properties.giftCount.title'),
        t('apps.broadcasts.properties.giftValue.title'),
      ]
      const keys = [
        'anchor',
        'time',
        'game',
        'table',
        'duration',
        'giftCount',
        'giftValue',
      ]

      const finalData = rows.map((row) => keys.map((k) => (row as any)[k]))
      finalData.unshift(headers)

      const worksheet = XLSX.utils.aoa_to_sheet(finalData)
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
        downloadBroadcasts().then()
      }}>
        <span>{t('common.export')}</span>
        <DownloadIcon />
      </Button>
    </div>
  )
}
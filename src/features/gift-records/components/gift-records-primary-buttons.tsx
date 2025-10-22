import { formatRFC3339 } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/giftRecords'
import { DownloadIcon, SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'
import { useAllAnchors } from '@/api/bridge/anchor.ts'
import { useAllGames } from '@/api/bridge/game.ts'
import { listGiftRecords } from '@/api/statistics/gift.ts'
import { currencyToString } from '@/utils/currency.ts'
import { formatToDate, formatToDateOnly } from '@/utils/time.ts'
import { Button } from '@/components/ui/button.tsx'
import { useAnchorFilter } from '@/components/context/anchor-filter-context.tsx'
import { useGameFilter } from '@/components/context/game-filter-context.tsx'
import { useRangeDate } from '@/components/context/range-date-context.tsx'
import { GiftRecordRow } from '@/features/gift-records/data/gift-record.ts'

export function GiftRecordsPrimaryButtons() {
  const { t } = useTranslation()

  const allGames = useAllGames()
  const allAnchors = useAllAnchors()

  const { begin, end } = useRangeDate()
  const { values: games } = useGameFilter()
  const { values: anchors } = useAnchorFilter()

  const be = formatToDateOnly(begin)
  const en = formatToDateOnly(end)

  const downloadRecords = async () => {
    const data = await listGiftRecords({
      begin: formatRFC3339(begin),
      end: formatRFC3339(end),
      gameIds: games,
      anchorIds: anchors,
    })

    if (allGames.isFetched && allAnchors.isFetched && data !== undefined) {
      const rows = data.map<GiftRecordRow>((d) => {
        const time = formatToDate(d.createdAt)

        const game = allGames.data?.find((g) => g.id === d.gameId)

        return {
          orderId: d.orderId,
          player: `${d.nickname} (${d.memberId})`,
          anchor:
            allAnchors.data?.find((info) => info.id === d.anchorId)?.nickname ??
            'unknown',
          time,
          game: game ? t(`apps.games.name.${game?.name}`) : 'unknown',
          roundId: d.roundId,
          tableName: d.tableName,
          giftName: d.giftName,
          giftValue: currencyToString(d.value),
          orderStatus: t(`common.giftRecords.status.${d.orderStatus}`),
        }
      })

      const title = t('layout.navigate.items.giftRecords')

      const headers = [
        t('apps.giftRecords.properties.orderId.title'),
        t('apps.giftRecords.properties.player.title'),
        t('apps.giftRecords.properties.receiver.title'),
        t('apps.giftRecords.properties.time.title'),
        t('apps.giftRecords.properties.game.title'),
        t('apps.giftRecords.properties.roundId.title'),
        t('apps.giftRecords.properties.tableName.title'),
        t('apps.giftRecords.properties.giftName.title'),
        t('apps.giftRecords.properties.giftValue.title'),
        t('apps.giftRecords.properties.orderStatus.title'),
      ]
      const keys = [
        'orderId',
        'player',
        'anchor',
        'time',
        'game',
        'roundId',
        'tableName',
        'giftName',
        'giftValue',
        'orderStatus',
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
        search={(prev) => ({ ...prev, begin: be, end: en, games, anchors })}
      >
        <Button>
          <span>{t('common.query')}</span>
          <SearchIcon />
        </Button>
      </Link>

      <Button
        className='space-x-1'
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          downloadRecords().then()
        }}
      >
        <span>{t('common.export')}</span>
        <DownloadIcon />
      </Button>
    </div>
  )
}
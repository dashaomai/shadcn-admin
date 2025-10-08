import { ColumnDef } from '@tanstack/react-table';
import { i18n } from '@/lib/i18n.ts';
import { cn } from '@/lib/utils.ts';
import { currencyToString } from '@/utils/currency.ts';
import { formatToDate, translateSeconds } from '@/utils/time.ts';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { AnchorSummary, BroadcastStatus } from '@/features/anchor-summaries/data/anchor-summary.ts';
import { AnchorInfo } from '@/features/games/data/anchor.ts';
import { GameInfo } from '@/features/games/data/game.ts'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header.tsx'


export const columns = (
  games?: GameInfo[],
  anchors?: AnchorInfo[]
): ColumnDef<AnchorSummary>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={i18n.t('apps.table.row.select-all')}
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={i18n.t('apps.table.row.select')}
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'anchorId',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchorSummaries.properties.nickname.title')}
      />
    ),
    cell: ({ row }) => {
      if (Array.isArray(anchors)) {
        const { anchorId } = row.original
        const anchor = anchors.find((a) => a.id === anchorId)

        return (
          <div className='w-fit text-nowrap overflow-ellipsis'>
            {anchor ? anchor.nickname : '-'}
          </div>
        )
      } else {
        return <div>-</div>
      }
    },

    meta: {
      displayTag: i18n.t('apps.anchorSummaries.properties.nickname.title'),
    },
    enableHiding: false,
  },

  {
    accessorKey: 'broadcastStatus',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchorSummaries.properties.broadcastStatus.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {i18n.t(`common.broadcast.status.${row.getValue('broadcastStatus')}`)}
      </div>
    ),

    meta: {
      displayTag: i18n.t(
        'apps.anchorSummaries.properties.broadcastStatus.title'
      ),
    },
  },

  {
    accessorKey: 'lastBroadcast',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchorSummaries.properties.lastBroadcast.title')}
      />
    ),
    cell: ({ row }) => {
      const { broadcastStatus, lastBegin, lastEnd } = row.original

      const begin = formatToDate(lastBegin)
      const end = broadcastStatus === BroadcastStatus.Finished ? formatToDate(lastEnd) : ''

      return (
        <div className='w-fit text-nowrap overflow-ellipsis'>
          {begin} - {end}
        </div>
      )
    },

    meta: {
      displayTag: i18n.t('apps.anchorSummaries.properties.lastBroadcast.title'),
    },
  },

  {
    accessorKey: 'lastGameId',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchorSummaries.properties.lastGame.title')}
      />
    ),
    cell: ({ row }) => {
      if (Array.isArray(games)) {
        const gameId = row.getValue('lastGameId') as number
        const game = games.find((g) => g.id === gameId)

        return (
          <div className='w-fit text-nowrap overflow-ellipsis'>
            {game ? i18n.t(`apps.games.name.${game.name}`) : '-'}
          </div>
        )
      } else {
        return <div>-</div>
      }
    },

    meta: {
      displayTag: i18n.t('apps.anchorSummaries.properties.lastGame.title'),
    },
  },

  {
    accessorKey: 'broadcastCount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchorSummaries.properties.broadcastCount.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {row.getValue('broadcastCount')}
      </div>
    ),

    meta: {
      displayTag: i18n.t(
        'apps.anchorSummaries.properties.broadcastCount.title'
      ),
    },
  },

  {
    accessorKey: 'broadcastDuration',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t(
          'apps.anchorSummaries.properties.broadcastDuration.title'
        )}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {translateSeconds(row.getValue('broadcastDuration'), i18n.t)}
      </div>
    ),

    meta: {
      displayTag: i18n.t(
        'apps.anchorSummaries.properties.broadcastDuration.title'
      ),
    },
  },

  {
    accessorKey: 'giftCount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchorSummaries.properties.giftCount.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {row.getValue('giftCount')}
      </div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchorSummaries.properties.giftCount.title'),
    },
  },

  {
    accessorKey: 'giftValue',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchorSummaries.properties.giftValue.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {currencyToString(row.getValue('giftValue'))}
      </div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchorSummaries.properties.giftValue.title'),
    },
  },
]
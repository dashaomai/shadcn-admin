import { ColumnDef } from '@tanstack/react-table';
import { BroadcastStatus } from '@/lib/broadcast.ts';
import { i18n } from '@/lib/i18n.ts';
import { formatToDate, translateSeconds } from '@/utils/time.ts';
import { Broadcast } from '@/features/broadcasts/data/broadcast.ts';
import { AnchorInfo } from '@/features/games/data/anchor.ts';
import { GameInfo } from '@/features/games/data/game.ts'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header.tsx'
import { currencyToString } from '@/utils/currency.ts'

export const columns = (
  games?: GameInfo[],
  anchors?: AnchorInfo[],
): ColumnDef<Broadcast>[] => [

  {
    accessorKey: 'anchorId',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.broadcasts.properties.anchor.title')}
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
      displayTag: i18n.t('apps.broadcasts.properties.anchor.title'),
    },
    enableHiding: false,
    enableSorting: false,
    filterFn: 'arrIncludesSome',
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.broadcasts.properties.broadcast.title')}
      />
    ),
    cell: ({ row }) => {
      const { status, begin, end } = row.original

      const be = formatToDate(begin)
      const en = status === BroadcastStatus.Finished ? formatToDate(end) : ''

      return (
        <div className='w-fit text-nowrap overflow-ellipsis'>
          {be} - {en}
        </div>
      )
    },

    meta: {
      displayTag: i18n.t('apps.broadcasts.properties.broadcast.title'),
    },
    enableSorting: false,
  },

  {
    accessorKey: 'gameId',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.broadcasts.properties.game.title')}
      />
    ),
    cell: ({ row }) => {
      if (Array.isArray(games)) {
        const gameId = row.getValue('gameId') as number
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
      displayTag: i18n.t('apps.broadcasts.properties.game.title'),
    },
  },

  {
    accessorKey: 'table',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t(
          'apps.broadcasts.properties.table.title'
        )}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {row.getValue('table')}
      </div>
    ),

    meta: {
      displayTag: i18n.t(
        'apps.broadcasts.properties.table.title'
      ),
    },
    sortingFn: 'alphanumeric',
  },

  {
    accessorKey: 'duration',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t(
          'apps.broadcasts.properties.duration.title'
        )}
      />
    ),
    cell: ({ row }) => {
      const {status, begin, end} = row.original

      const output = status === BroadcastStatus.Finished ?
        translateSeconds((new Date(end).getTime() - new Date(begin).getTime()) / 1000, i18n.t) :
        '-'

      return (
        <div className='w-fit text-nowrap overflow-ellipsis'>
          {output}
        </div>
      )
    },

    meta: {
      displayTag: i18n.t(
        'apps.broadcasts.properties.duration.title'
      ),
    },
    enableSorting: false,
  },

  {
    accessorKey: 'giftCount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.broadcasts.properties.giftCount.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {row.getValue('giftCount')}
      </div>
    ),

    meta: {
      displayTag: i18n.t('apps.broadcasts.properties.giftCount.title'),
    },
  },

  {
    accessorKey: 'giftValue',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.broadcasts.properties.giftValue.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {currencyToString(row.getValue('giftValue'))}
      </div>
    ),

    meta: {
      displayTag: i18n.t('apps.broadcasts.properties.giftValue.title'),
    },
  },
]
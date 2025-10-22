import { ColumnDef } from '@tanstack/react-table';
import { i18n } from '@/lib/i18n.ts';
import { currencyToString } from '@/utils/currency.ts';
import { formatToDate } from '@/utils/time.ts';
import { AnchorInfo } from '@/features/games/data/anchor.ts'
import { GameInfo } from '@/features/games/data/game.ts'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header.tsx';
import { GiftRecord } from '@/features/gift-records/data/gift-record.ts'

export const columns = (
  games?: GameInfo[],
  anchors?: AnchorInfo[]
): ColumnDef<GiftRecord>[] => [

  {
    accessorKey: 'orderId',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.giftRecords.properties.orderId.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {row.getValue('orderId')}
      </div>
    ),

    meta: {
      displayTag: i18n.t(
        'apps.giftRecords.properties.orderId.title'
      ),
    },
  },

  {
    accessorKey: 'nickname',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.giftRecords.properties.player.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {row.getValue('nickname')} ({row.getValue('memberId')})
      </div>
    ),

    meta: {
      displayTag: i18n.t(
        'apps.giftRecords.properties.player.title'
      ),
    },
  },

  {
    accessorKey: 'anchorId',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.giftRecords.properties.receiver.title')}
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
      displayTag: i18n.t('apps.giftRecords.properties.receiver.title'),
    },
    enableHiding: false,
    filterFn: 'arrIncludesSome',
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.giftRecords.properties.time.title')}
      />
    ),
    cell: ({ row }) => {
      const { createdAt } = row.original

      const time = formatToDate(createdAt)
      return (
        <div className='w-fit text-nowrap overflow-ellipsis'>
          {time}
        </div>
      )
    },

    meta: {
      displayTag: i18n.t('apps.giftRecords.properties.time.title'),
    },
  },

  {
    accessorKey: 'gameId',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.giftRecords.properties.game.title')}
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
      displayTag: i18n.t('apps.giftRecords.properties.game.title'),
    },
  },

  {
    accessorKey: 'roundId',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.giftRecords.properties.roundId.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {row.getValue('roundId')}
      </div>
    ),

    meta: {
      displayTag: i18n.t(
        'apps.giftRecords.properties.roundId.title'
      ),
    },
  },

  {
    accessorKey: 'tableName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t(
          'apps.giftRecords.properties.tableName.title'
        )}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {row.getValue('tableName')}
      </div>
    ),

    meta: {
      displayTag: i18n.t(
        'apps.giftRecords.properties.tableName.title'
      ),
    },
  },

  {
    accessorKey: 'giftName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.giftRecords.properties.giftName.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {row.getValue('giftName')}
      </div>
    ),

    meta: {
      displayTag: i18n.t('apps.giftRecords.properties.giftName.title'),
    },
  },

  {
    accessorKey: 'giftValue',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.giftRecords.properties.giftValue.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {currencyToString(row.getValue('giftValue'))}
      </div>
    ),

    meta: {
      displayTag: i18n.t('apps.giftRecords.properties.giftValue.title'),
    },
  },

  {
    accessorKey: 'orderStatus',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.giftRecords.properties.orderStatus.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {i18n.t(`common.order.status.${row.getValue('orderStatus')}`)}
      </div>
    ),

    meta: {
      displayTag: i18n.t(
        'apps.giftRecords.properties.orderStatus.title'
      ),
    },
  },
]
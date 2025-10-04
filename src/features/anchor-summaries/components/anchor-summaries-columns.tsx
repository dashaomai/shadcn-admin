import { ColumnDef } from '@tanstack/react-table'
import { AnchorSummary } from '@/features/anchor-summaries/data/anchor-summary.ts'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { i18n } from '@/lib/i18n.ts'
import { cn } from '@/lib/utils.ts'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header.tsx'

export const columns: ColumnDef<AnchorSummary>[] = [
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
    accessorKey: 'nickname',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchor-summaries.properties.nickname.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>{row.getValue('nickname')}</div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchor-summaries.properties.nickname.title'),
    },
    enableHiding: false,
  },

  {
    accessorKey: 'broadcastStatus',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchor-summaries.properties.broadcastStatus.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>{row.getValue('broadcastStatus')}</div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchor-summaries.properties.broadcastStatus.title'),
    },
  },

  {
    accessorKey: 'lastBroadcast',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchor-summaries.properties.lastBroadcast.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>{row.getValue('lastBroadcast')}</div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchor-summaries.properties.lastBroadcast.title'),
    },
  },

  {
    accessorKey: 'lastGame',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchor-summaries.properties.lastGame.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>{row.getValue('lastGame')}</div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchor-summaries.properties.lastGame.title'),
    },
  },

  {
    accessorKey: 'broadcastCount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchor-summaries.properties.broadcastCount.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>{row.getValue('broadcastCount')}</div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchor-summaries.properties.broadcastCount.title'),
    },
  },

  {
    accessorKey: 'broadcastDuration',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchor-summaries.properties.broadcastDuration.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>{row.getValue('broadcastDuration')}</div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchor-summaries.properties.broadcastDuration.title'),
    },
  },

  {
    accessorKey: 'giftCount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchor-summaries.properties.giftCount.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>{row.getValue('giftCount')}</div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchor-summaries.properties.giftCount.title'),
    },
  },

  {
    accessorKey: 'giftValue',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchor-summaries.properties.giftValue.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>{row.getValue('giftValue')}</div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchor-summaries.properties.giftValue.title'),
    },
  },

]
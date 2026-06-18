import { ColumnDef } from '@tanstack/react-table';
import { i18n } from '@/lib/i18n.ts';
import { cn } from '@/lib/utils.ts';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { TablesRowBroadcast } from '@/features/tables/components/tables-row-broadcast.tsx';
import { TableInfo, TableStatusDescriptions } from '@/features/tables/data/table.ts';
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header.tsx';
import { GameInfo } from '@/features/games/data/game';


export const columns = (game?: GameInfo): ColumnDef<TableInfo>[] => {
  if (!game) {
    return []
  }

  return [
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
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={i18n.t('apps.tables.properties.id.title')}
        />
      ),
      cell: ({ row }) => (
        <div className='w-fit text-nowrap'>{row.getValue('id')}</div>
      ),
      meta: {
        className: cn(
          'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
          'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
          'sticky left-6 md:table-cell'
        ),
        displayTag: i18n.t('apps.tables.properties.id.title'),
      },
      enableHiding: false,
    },

    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={i18n.t('apps.tables.properties.name.title')}
        />
      ),
      cell: ({ row }) => (
        <div className='w-fit text-nowrap'>{`${i18n.t('apps.games.shortname.' + game.name)} ${row.getValue('id')}`}</div>
      ),
      meta: {
        className: cn(
          'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
          'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
          'sticky left-6 md:table-cell'
        ),
        displayTag: i18n.t('apps.tables.properties.name.title'),
      },
      enableHiding: false,
    },

    {
      accessorKey: 'password',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={i18n.t('apps.tables.properties.catalog.title')}
        />
      ),
      cell: ({ row }) => (
        <div className='w-fit'>
          {i18n.t(
            `common.tables.properties.catalog.${row.getValue('password') ? 'private' : 'public'}`
          )}
        </div>
      ),
      meta: {
        displayTag: i18n.t('apps.tables.properties.catalog.title'),
      },
    },

    {
      accessorKey: 'password',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={i18n.t('apps.tables.properties.password.title')}
        />
      ),
      cell: ({ row }) => <div className='w-fit'>{row.getValue('password')}</div>,
      meta: {
        displayTag: i18n.t('apps.tables.properties.catalog.title'),
      },
    },

    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={i18n.t('apps.tables.properties.type.title')}
        />
      ),
      cell: ({ row }) => (
        <div className='w-fit'>
          {i18n.t(
            `common.tables.properties.type.${row.getValue<number>('type')}`
          )}
        </div>
      ),
      meta: {
        displayTag: i18n.t('apps.tables.properties.type.title'),
      },
    },

    {
      accessorKey: 'orders',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={i18n.t('apps.tables.properties.orders.title')}
        />
      ),
      cell: ({ row }) => (
        <div className='w-fit'>{row.getValue<number>('orders')}</div>
      ),
      meta: {
        displayTag: i18n.t('apps.tables.properties.orders.title'),
      },
    },

    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={i18n.t('apps.tables.properties.status.title')}
        />
      ),
      cell: ({ row }) => (
        <div className='w-fit'>
          {i18n.t(
            `apps.tables.properties.status.${TableStatusDescriptions[row.getValue<number>('status')]}`
          )}
        </div>
      ),
      filterFn: 'numberIn',
      meta: {
        displayTag: i18n.t('apps.tables.properties.status.title'),
      },
    },

    {
      id: 'broadcast',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={i18n.t('apps.tables.properties.broadcast.title')}
        />
      ),
      cell: TablesRowBroadcast,
    },
  ]
}

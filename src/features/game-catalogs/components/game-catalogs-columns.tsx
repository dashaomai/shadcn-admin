import { ColumnDef } from '@tanstack/react-table'
import { i18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header'
import {
  GameCatalogInfo,
  GameCatalogStatusDescriptions,
} from '../data/game-catalog'
import { GameCatalogsRowActions } from './game-catalogs-row-actions'

export const columns: ColumnDef<GameCatalogInfo>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.game-catalogs.properties.name.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue('name')}</div>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
      displayTag: i18n.t('apps.game-catalogs.properties.name.title'),
    },
    enableHiding: false,
  },

  {
    accessorKey: 'displayOrder',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.game-catalogs.properties.displayOrder.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit'>{row.getValue<number>('displayOrder')}</div>
    ),
    meta: {
      displayTag: i18n.t('apps.game-catalogs.properties.displayOrder.title'),
    },
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.game-catalogs.properties.status.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit'>
        {i18n.t(
          `apps.game-catalogs.properties.status.${GameCatalogStatusDescriptions[row.getValue<number>('status')]}`
        )}
      </div>
    ),
    filterFn: 'numberIn',
    meta: {
      displayTag: i18n.t('apps.game-catalogs.properties.status.title'),
    },
  },

  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.game-catalogs.properties.description.title')}
      />
    ),
    cell: ({ row }) => (
      <LongText className='w-fit'>{row.getValue('description')}</LongText>
    ),

    meta: {
      displayTag: i18n.t('apps.game-catalogs.properties.description.title'),
    },
  },

  {
    id: 'actions',
    cell: GameCatalogsRowActions,
  },
]

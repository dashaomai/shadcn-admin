import { ColumnDef } from '@tanstack/react-table'
import { i18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header'
import {
  PublisherInfo,
  PublisherStatusDescriptions,
  PublisherTypeDescriptions,
} from '../data/publisher'
import { PublishersRowActions } from './publishers-row-actions'

export const columns: ColumnDef<PublisherInfo>[] = [
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
        title={i18n.t('apps.publishers.properties.name.title')}
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
      displayTag: i18n.t('apps.publishers.properties.name.title'),
    },
    enableHiding: false,
  },

  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.publishers.properties.type.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit'>
        {i18n.t(
          `apps.publishers.properties.type.${PublisherTypeDescriptions[row.getValue<number>('type')]}`
        )}
      </div>
    ),
    filterFn: 'numberIn',
    meta: {
      displayTag: i18n.t('apps.publishers.properties.type.title'),
    },
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.publishers.properties.status.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit'>
        {i18n.t(
          `apps.publishers.properties.status.${PublisherStatusDescriptions[row.getValue<number>('status')]}`
        )}
      </div>
    ),
    filterFn: 'numberIn',
    meta: {
      displayTag: i18n.t('apps.publishers.properties.status.title'),
    },
  },

  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.publishers.properties.description.title')}
      />
    ),
    cell: ({ row }) => (
      <LongText className='w-fit'>{row.getValue('description')}</LongText>
    ),

    meta: {
      displayTag: i18n.t('apps.publishers.properties.description.title'),
    },
  },

  {
    id: 'actions',
    cell: PublishersRowActions,
  },
]

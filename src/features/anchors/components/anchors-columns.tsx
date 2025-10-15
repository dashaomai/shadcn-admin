import { ColumnDef } from '@tanstack/react-table'
import { AnchorConfiguration } from '@/features/anchors/data/anchor-info.ts'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header.tsx'
import { i18n } from '@/lib/i18n.ts'
import { AnchorsRowActions } from '@/features/anchors/components/anchors-row-actions.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { cn } from '@/lib/utils.ts'

export const columns: ColumnDef<AnchorConfiguration>[] = [

  {
    id: 'id',
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
        value={row.getValue('id')}
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
        title={i18n.t('apps.anchors.properties.nickname.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {row.getValue('nickname')}
      </div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchors.properties.nickname.title'),
    },
    enableHiding: false,
  },

  {
    accessorKey: 'avatar',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchors.properties.avatar.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {row.getValue('avatar')}
      </div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchors.properties.avatar.title'),
    },
    enableHiding: false,
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchors.properties.status.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {i18n.t(`common.accounts.properties.status.${row.getValue('status')}`)}
      </div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchors.properties.status.title'),
    },
    enableHiding: false,
  },

  {
    accessorKey: 'specialStatus',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchors.properties.specialStatus.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap overflow-ellipsis'>
        {i18n.t(`common.anchors.properties.specialStatus.${row.getValue('specialStatus')}`)}
      </div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchors.properties.specialStatus.title'),
    },
    enableHiding: false,
  },

  {
    id: 'actions',
    cell: AnchorsRowActions,
  },

]
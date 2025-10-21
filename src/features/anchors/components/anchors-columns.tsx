import { ColumnDef } from '@tanstack/react-table';
import { i18n } from '@/lib/i18n.ts';
import { AnchorsRowActions } from '@/features/anchors/components/anchors-row-actions.tsx';
import { AnchorConfiguration } from '@/features/anchors/data/anchor-info.ts';
import { AnchorInfo } from '@/features/games/data/anchor.ts';
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header.tsx';


export const columns = (anchors?: AnchorInfo[]): ColumnDef<AnchorConfiguration>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.anchors.properties.nickname.title')}
      />
    ),
    cell: ({ row }) => {
      if (Array.isArray(anchors)) {
        const { id } = row.original
        const anchor = anchors.find((a) => a.id === id)

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
    cell: ({ row }) => {
      const avatar = row.getValue<string>('avatar')

      return (
        <div className='w-fit text-center overflow-ellipsis'>
          {!!avatar && (
            <img
              style={{ width: '173px', height: '220px' }}
              src={avatar}
              alt='avatar'
            />
          )}
          {!avatar && (
            <div className='min-w-[173px]'>
              <p>{i18n.t('apps.anchors.properties.avatar.tip')}</p>
              <p>{i18n.t('apps.anchors.properties.avatar.pixels')}</p>
            </div>
          )}
        </div>
      )
    },

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
        {i18n.t(
          `common.anchors.properties.specialStatus.${row.getValue('specialStatus')}`
        )}
      </div>
    ),

    meta: {
      displayTag: i18n.t('apps.anchors.properties.specialStatus.title'),
    },
  },

  {
    id: 'actions',
    cell: AnchorsRowActions,
  },
]
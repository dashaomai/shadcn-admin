import { ColumnDef } from '@tanstack/react-table'
import { TinyRoles } from '@/lib/auth.ts'
import { i18n } from '@/lib/i18n.ts'
import { cn } from '@/lib/utils.ts'
import { getFallback } from '@/utils/avatar.ts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import LongText from '@/components/long-text.tsx'
import { AccountsRowActions } from '@/features/accounts/components/accounts-row-actions.tsx'
import { AccountInfo } from '@/features/accounts/data/account-info.ts'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header.tsx'

export const columns: ColumnDef<AccountInfo>[] = [
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
    accessorKey: 'loginName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.accounts.properties.loginName.title')}
      />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-24'>{row.getValue('loginName')}</LongText>
    ),

    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
      displayTag: i18n.t('apps.accounts.properties.loginName.title'),
    },
    enableHiding: false,
    enableSorting: false,
  },

  {
    id: 'profileNickname',
    accessorFn: (row) => row.profile.nickname,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.accounts.properties.profile.nickname.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue('profileNickname')}</div>
    ),

    meta: {
      displayTag: i18n.t('apps.accounts.properties.profile.nickname.title'),
    },

    enableSorting: false,
  },

  {
    id: 'profileEmail',
    accessorFn: (row) => row.profile.email,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.accounts.properties.profile.email.title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue('profileEmail')}</div>
    ),

    meta: {
      displayTag: i18n.t('apps.accounts.properties.profile.email.title'),
    },
  },

  {
    id: 'profileAvatar',
    accessorFn: (row) => row.profile.avatar,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.accounts.properties.profile.avatar.title')}
      />
    ),
    cell: ({ row }) => (
      <Avatar className='h-8 w-8 rounded-lg'>
        <AvatarImage
          src={row.getValue('profileAvatar')}
          alt={row.getValue('profileNickname')}
        />
        <AvatarFallback className='rounded-lg'>
          {getFallback(row.getValue('profileNickname'))}
        </AvatarFallback>
      </Avatar>
    ),

    meta: {
      displayTag: i18n.t('apps.accounts.properties.profile.avatar.title'),
    },
  },

  {
    accessorKey: 'roles',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('apps.accounts.properties.roles.title')}
      />
    ),
    cell: ({ row }) => {
      const roles = row.getValue('roles')

      if (roles) {
        return (
          <div className='flex w-fit flex-row space-x-2 text-nowrap'>
            {(row.getValue('roles') as TinyRoles)?.map((role: string) => (
              <Badge
                key={role}
                variant='default'
                className='text-sm capitalize'
              >
                {role}
              </Badge>
            ))}
          </div>
        )
      } else {
        return (
          <p className='text-gray-300'>
            {i18n.t('apps.accounts.properties.roles.empty')}
          </p>
        )
      }
    },
    filterFn: 'arrIncludesSome',

    meta: {
      displayTag: i18n.t('apps.accounts.properties.roles.title'),
    },
  },

  {
    id: 'actions',
    cell: AccountsRowActions,
  },
]

import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { useAccounts } from '@/features/accounts/context/accounts-context.tsx'
import { AccountInfo } from '@/features/accounts/data/account-info.ts'
import { i18n } from '@/lib/i18n.ts'
import { DataTableRowActionsProps } from '@/lib/list-app.ts'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEdit, IconRecycle, IconUsersGroup } from '@tabler/icons-react'

type Props = DataTableRowActionsProps<AccountInfo>

export function AccountsRowActions({ row }: Props) {
  const { setOpen, setCurrentRow } = useAccounts()

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>
              {i18n.t('apps.table.actions.open-menu')}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('update')
            }}
          >
          {i18n.t('apps.accounts.actions.edit')}
          <DropdownMenuShortcut>
            <IconEdit size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('update-roles')
            }}
          >
          {i18n.t('apps.accounts.actions.edit-roles')}
          <DropdownMenuShortcut>
            <IconUsersGroup size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('reset-password')
            }}
            className='!text-red-500'
          >
            {i18n.t('apps.accounts.actions.reset-password')}
            <DropdownMenuShortcut>
              <IconRecycle size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { IconEdit, IconUsersGroup } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useRoles } from '@/api/auth.ts';
import { DataTableRowActionsProps } from '@/lib/list-app.ts';
import { gteAdmin, gteAnchorManager, isAnchor, rolesCheck } from '@/lib/role.ts'
import { Button } from '@/components/ui/button.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx';
import { useAccounts } from '@/features/accounts/context/accounts-context.tsx';
import { AccountInfo } from '@/features/accounts/data/account-info.ts';


type Props = DataTableRowActionsProps<AccountInfo>

export function AccountsRowActions({ row }: Props) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useAccounts()

  const rolesQuery = useRoles()

  return (
    <>
      {
        (rolesCheck(rolesQuery.data, gteAdmin) || (rolesCheck(rolesQuery.data, gteAnchorManager) && rolesCheck(row.original.roles, isAnchor))) && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
              >
                <DotsHorizontalIcon className='h-4 w-4' />
                <span className='sr-only'>{t('apps.table.actions.open-menu')}</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-[160px]'>
              <>
                <DropdownMenuItem
                  onClick={() => {
                    setCurrentRow(row.original)
                    setOpen('update')
                  }}
                >
                  {t('apps.accounts.actions.edit')}
                  <DropdownMenuShortcut>
                    <IconEdit size={16} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </>

              {rolesCheck(rolesQuery.data, gteAdmin) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setCurrentRow(row.original)
                      setOpen('update-roles')
                    }}
                  >
                    {t('apps.accounts.actions.edit-roles')}
                    <DropdownMenuShortcut>
                      <IconUsersGroup size={16} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    </>
  )
}

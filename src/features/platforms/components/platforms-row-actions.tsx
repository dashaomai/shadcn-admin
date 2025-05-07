import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEdit, IconUsersGroup } from '@tabler/icons-react'
import { DataTableRowActionsProps } from '@/lib/list-app'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePlatforms } from '../context/platforms-context'
import { PlatformInfo } from '../data/platform'
import { useTranslation } from 'react-i18next'

type Props = DataTableRowActionsProps<PlatformInfo>

export function PlatformsRowActions({ row }: Props) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = usePlatforms()

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
              {t('apps.table.actions.open-menu')}
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
            {t('apps.platforms.actions.edit')}
            <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

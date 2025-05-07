import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEdit } from '@tabler/icons-react'
import { DataTableRowActionsProps } from '@/lib/list-app'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDevelopers } from '../context/developers-context'
import { DeveloperInfo } from '../data/developer'
import { useTranslation } from 'react-i18next'

type Props = DataTableRowActionsProps<DeveloperInfo>

export function DevelopersRowActions({ row }: Props) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useDevelopers()

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
            {t('apps.developers.actions.edit')}
            <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEdit } from '@tabler/icons-react'
import { i18n } from '@/lib/i18n'
import { DataTableRowActionsProps } from '@/lib/list-app'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTags } from '../context/tags-context'
import { TagInfo } from '../data/tag'

type Props = DataTableRowActionsProps<TagInfo>

export function TagsRowActions({ row }: Props) {
  const { setOpen, setCurrentRow } = useTags()

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
            {i18n.t('apps.tags.actions.edit')}
            <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

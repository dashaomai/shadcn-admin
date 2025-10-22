import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEdit } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { DataTableRowActionsProps } from '@/lib/list-app.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { useAnchors } from '@/features/anchors/context/anchors-context.tsx'
import { AnchorConfiguration } from '@/features/anchors/data/anchor-info.ts'

type Props = DataTableRowActionsProps<AnchorConfiguration>

export function AnchorsRowActions({ row }: Props) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useAnchors()

  return (
    <>
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
              {t('apps.anchors.actions.edit')}
              <DropdownMenuShortcut>
                <IconEdit size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
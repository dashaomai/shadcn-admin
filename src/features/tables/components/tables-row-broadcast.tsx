import { FormEvent } from 'react'
import { IconBroadcast } from '@tabler/icons-react'
import logger from 'loglevel'
import { i18n } from '@/lib/i18n.ts'
import { DataTableRowActionsProps } from '@/lib/list-app.ts'
import { obs } from '@/lib/obs-ws.ts'
import { Button } from '@/components/ui/button.tsx'
import { TableInfo } from '@/features/tables/data/table.ts'

type Props = DataTableRowActionsProps<TableInfo>

export function TablesRowBroadcast({ row }: Props) {
  const url = `/${row.original.name}`

  function handleBroadcast(_event: FormEvent<HTMLElement>) {
    logger.info('handleBroadcast start', url)
    obs
      .call('GetStreamStatus')
      .then((resp) => logger.info('handleBroadcast finished', resp))
  }

  return (
    <Button variant='default' onClick={handleBroadcast}>
      <IconBroadcast className='h-4 w-4' />
      <span className=''>{i18n.t('apps.tables.actions.start-broadcast')}</span>
    </Button>
  )
}
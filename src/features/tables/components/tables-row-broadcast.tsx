import { FormEvent } from 'react'
import { IconBroadcast } from '@tabler/icons-react'
import logger from 'loglevel'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CreateBroadcastRequest } from '@/api/vod/broadcast.ts'
import { useBroadcastStore } from '@/stores/broadcastStore.ts'
import { useVendorStore } from '@/stores/vendorStore.ts'
import { DataTableRowActionsProps } from '@/lib/list-app.ts'
import { obs } from '@/lib/obs-ws.ts'
import { Button } from '@/components/ui/button.tsx'
import { TableInfo } from '@/features/tables/data/table.ts'

type Props = DataTableRowActionsProps<TableInfo>

const outputs: string[] = ['DelayEnable', 'false', 'LowLatencyEnable', 'false']

const simpleOutputs: string[] = [
  'VBitrate',
  '2500',
  'ABitrate',
  '160',
  'Preset',
  'ultrafast',
  'StreamEncoder',
  'apple_h264',
  'StreamAudioEncoder',
  'opus',
  'RecEncoder',
  'apple_h264',
  'RecAudioEncoder',
  'opus',
]

const advOuts: string[] = [
  'AudioEncoder',
  'ffmpeg_opus',
  'RecAudioEncoder',
  'CoreAudio_AAC',
  'Encoder',
  'com.apple.videotoolbox.videoencoder.ave.avc',
  'RecEncoder',
  'com.apple.video.toolbox.videoencoder.ave.avc',
]

export function TablesRowBroadcast({ row }: Props) {
  const { t } = useTranslation()
  const vendorStore = useVendorStore()
  const broadcastStore = useBroadcastStore()

  const url = `/${row.original.name}`

  async function handleStartBroadcast(_event: FormEvent<HTMLElement>) {
    logger.info('handleBroadcast start', url)

    if (!obs.identified) {
      await obs.connect()
    }

    await obs.call('SetStreamServiceSettings', {
      streamServiceType: 'whip_custom',
      streamServiceSettings: {
        server: 'https://webrtcpush.tlivewebrtcpush.com/webrtc/v2/whip',
        bearer_token:
          'webrtc://testput.leopardcat.live/live/tput101?txSecret=481d6a5a106edf19cd028b7e24bcad9e&txTime=7AC4FEB7',
      },
    })

    for (let i = 0; i < outputs.length; i += 2) {
      await obs.call('SetProfileParameter', {
        parameterCategory: 'Output',
        parameterName: outputs[i],
        parameterValue: outputs[i + 1],
      })
    }

    for (let i = 0; i < simpleOutputs.length; i += 2) {
      await obs.call('SetProfileParameter', {
        parameterCategory: 'SimpleOutput',
        parameterName: simpleOutputs[i],
        parameterValue: simpleOutputs[i + 1],
      })
    }

    for (let i = 0; i < advOuts.length; i += 2) {
      await obs.call('SetProfileParameter', {
        parameterCategory: 'AdvOut',
        parameterName: advOuts[i],
        parameterValue: advOuts[i + 1],
      })
    }

    setTimeout(async () => {
      await obs.call('StartStream')
      logger.info('handleBroadcast finished')

      const expiredAt = new Date(Date.now() + 24 * 3600 * 1000)
      const request: CreateBroadcastRequest = {
        vendorName: vendorStore.vendor?.name ?? '',
        domain: 'testput.leopardcat.live',
        gameId: row.original.gameId,
        gameName: 'bc_baccarat',
        tableId: row.original.id,
        tableName: row.original.name,
        expiredAt: expiredAt.toISOString(),
      }

      await broadcastStore.createBroadcast(request)

      toast.info(t('apps.tables.properties.broadcast.started'), {
        description: t('apps.tables.properties.broadcast.started-description'),
      })
    }, 1000)
  }

  async function handleStopBroadcast(_event: FormEvent<HTMLElement>) {
    if (!obs.identified) {
      await obs.connect()
    }

    await obs.call('StopStream')

    await obs.disconnect()

    await broadcastStore.finishBroadcast()

    toast.info(t('apps.tables.properties.broadcast.stopped'), {
      description: t('apps.tables.properties.broadcast.stopped-description'),
    })
  }

  return (
    <>
      {broadcastStore.broadcast?.tableId === row.original.id && (
        <Button variant='secondary' onClick={handleStopBroadcast}>
          <IconBroadcast className='h-4 w-4' />
          <span>{t('apps.tables.actions.stop-broadcast')}</span>
        </Button>
      )}
      {!broadcastStore.broadcast && (
        <Button variant='default' onClick={handleStartBroadcast}>
          <IconBroadcast className='h-4 w-4' />
          <span>{t('apps.tables.actions.start-broadcast')}</span>
        </Button>
      )}
    </>
  )
}
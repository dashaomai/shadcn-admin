import { FormEvent } from 'react'
import { IconBroadcast } from '@tabler/icons-react'
import logger from 'loglevel'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAllGames } from '@/api/bridge/game.ts'
import { CreateBroadcastRequest, generateUrl } from '@/api/vod/broadcast.ts'
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
  const allGames = useAllGames()

  const url = `/${row.original.name}`

  async function handleStartBroadcast(_event: FormEvent<HTMLElement>) {
    logger.info('handleStartBroadcast', url)

    let gameName: string = ''
    const tableName: string = row.original.name

    if (!allGames.isFetched) {
      logger.warn('handleStartBroadcast games not fetch')

      toast.error(t('apps.tables.properties.broadcast.api-error'), {
        description: t(
          'apps.tables.properties.broadcast.api-error-description'
        ),
      })

      return
    } else {
      const gameInfo = allGames.data?.find(
        (info) => info.id === row.original.gameId
      )
      if (gameInfo) {
        gameName = gameInfo.name
      } else {
        logger.error('game info not found', row.original.gameId)

        toast.error(t('apps.tables.properties.broadcast.api-error'), {
          description: t(
            'apps.tables.properties.broadcast.api-error-description'
          ),
        })

        return
      }
    }

    const response = await generateUrl(gameName, tableName)
    if (!response) {
      return
    }

    try {
      if (!obs.identified) {
        await obs.connect()
      }

      await obs.call('SetStreamServiceSettings', {
        streamServiceType: 'whip_custom',
        streamServiceSettings: {
          server: 'https://webrtcpush.tlivewebrtcpush.com/webrtc/v2/whip',
          bearer_token: response.push,
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

      await obs.call('StartStream')
    } catch (e) {
      logger.error('handleStartBroadcast obs error', e)

      toast.error(t('apps.tables.properties.broadcast.start-error'), {
        description: t(
          'apps.tables.properties.broadcast.start-error-description'
        ),
      })

      return
    }

    try {
      const expiredAt = new Date(Date.now() + 24 * 3600 * 1000)

      const request: CreateBroadcastRequest = {
        vendorName: vendorStore.vendor?.name ?? '',
        domain: '',
        gameId: row.original.gameId,
        gameName: gameName,
        tableId: row.original.id,
        tableName: row.original.name,
        expiredAt: expiredAt.toISOString(),
      }

      await broadcastStore.createBroadcast(request)
    } catch (e) {
      logger.error('handleStartBroadcast api error', e)

      toast.error(t('apps.tables.properties.broadcast.api-error'), {
        description: t(
          'apps.tables.properties.broadcast.api-error-description'
        ),
      })

      await obs.call('StopStream')

      return
    }

    logger.info('handleStartBroadcast finished')

    toast.info(t('apps.tables.properties.broadcast.started'), {
      description: t('apps.tables.properties.broadcast.started-description'),
    })
  }

  async function handleStopBroadcast(_event: FormEvent<HTMLElement>) {
    logger.info('handleStopBroadcast')

    try {
      if (!obs.identified) {
        await obs.connect()
      }

      await obs.call('StopStream')

      await obs.disconnect()
    } catch (e) {
      logger.error('handleStopBroadcast obs error', e)

      toast.error(t('apps.tables.properties.broadcast.stop-error'), {
        description: t(
          'apps.tables.properties.broadcast.stop-error-description'
        ),
      })
    }

    try {
      await broadcastStore.finishBroadcast()
    } catch (e) {
      logger.error('handleStopBroadcast api error', e)

      toast.error(t('apps.tables.properties.broadcast.api-error'), {
        description: t(
          'apps.tables.properties.broadcast.api-error-description'
        ),
      })

      return
    }

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
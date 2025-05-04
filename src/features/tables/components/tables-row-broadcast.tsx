import { FormEvent } from 'react'
import { IconBroadcast } from '@tabler/icons-react'
import logger from 'loglevel'
import { i18n } from '@/lib/i18n.ts'
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
  const url = `/${row.original.name}`

  async function handleBroadcast(_event: FormEvent<HTMLElement>) {
    logger.info('handleBroadcast start', url)

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
    }, 1000)
  }

  return (
    <Button variant='default' onClick={handleBroadcast}>
      <IconBroadcast className='h-4 w-4' />
      <span className=''>{i18n.t('apps.tables.actions.start-broadcast')}</span>
    </Button>
  )
}
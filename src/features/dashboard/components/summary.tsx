import {
  IconBroadcast,
  IconClockHour10,
  IconDeviceGamepad,
  IconUsersGroup,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import {
  getPrevDate,
  SummaryDate,
  useDailySummary,
} from '@/api/statistics/summary.ts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'

export type SummaryCardsProps = {
  date: SummaryDate
}

export default function SummaryCards({ date }: SummaryCardsProps) {
  const { t } = useTranslation()
  const dailySummary = useDailySummary(date)
  const prevDailySummary = useDailySummary(getPrevDate(date))

  if (!dailySummary.isFetched || !prevDailySummary.isFetched) {
    return <>Loading...</>
  }

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('apps.dashboard.anchor.amount')}
          </CardTitle>
          <IconUsersGroup />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {dailySummary.data?.anchorAmount}
          </div>
          <p className='text-muted-foreground text-xs'>
            {t('apps.dashboard.anchor.diff-from', {
              diff:
                dailySummary.data!.anchorAmount -
                prevDailySummary.data!.anchorAmount,
            })}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('apps.dashboard.game.amount')}
          </CardTitle>
          <IconDeviceGamepad />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {dailySummary.data?.gameAmount}
          </div>
          <p className='text-muted-foreground text-xs'>
            {t('apps.dashboard.game.diff-from', {
              diff:
                dailySummary.data!.gameAmount -
                prevDailySummary.data!.gameAmount,
            })}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('apps.dashboard.broadcast-amount.title')}
          </CardTitle>
          <IconBroadcast />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {dailySummary.data?.broadcastAmount}
          </div>
          <p className='text-muted-foreground text-xs'>
            {t('apps.dashboard.broadcast-amount.diff-from', {
              diff:
                dailySummary.data!.broadcastAmount -
                prevDailySummary.data!.broadcastAmount,
            })}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('apps.dashboard.broadcast-duration.title')}
          </CardTitle>
          <IconClockHour10 />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {dailySummary.data?.broadcastDuration}
          </div>
          <p className='text-muted-foreground text-xs'>
            {t('apps.dashboard.broadcast-duration.diff-from', {
              diff:
                dailySummary.data!.broadcastDuration -
                prevDailySummary.data!.broadcastDuration,
            })}
          </p>
        </CardContent>
      </Card>
    </>
  )
}

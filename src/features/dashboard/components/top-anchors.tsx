import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { useTopAnchors } from '@/api/statistics/anchor.ts'
import { ListRequest, SummaryDate } from '@/api/statistics/summary.ts'
import { getFallback } from '@/utils/avatar.ts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export type TopAnchorsProps = {
  date: SummaryDate
}

export function TopAnchors({ date }: TopAnchorsProps) {
  const { t } = useTranslation()
  const end =
    date === 'today'
      ? DateTime.now().startOf('hour')
      : DateTime.now().startOf('day').minus({ day: 1 })
  const begin = end.startOf('day').minus({ day: 1 })
  const param: ListRequest = {
    begin: begin.toISO(),
    end: end.toISO(),
    limit: 5,
  }

  const topAnchors = useTopAnchors(param)

  if (!topAnchors.isFetched) {
    return <p>Loading</p>
  }

  return (
    <div className='space-y-8'>
      {topAnchors.data?.map((anchor) => (
        <div key={anchor.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={anchor.avatar} alt='Avatar' />
            <AvatarFallback>{getFallback(anchor.nickname)}</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {anchor.nickname}
              </p>
              <p className='text-muted-foreground text-sm'>{anchor.email}</p>
            </div>
            <div className='font-medium'>
              {t('apps.dashboard.top-anchors.score', {
                amount: anchor.broadcastAmount,
                duration: anchor.broadcastDuration,
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

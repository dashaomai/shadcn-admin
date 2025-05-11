import { DateTime } from 'luxon'
import { useTopAnchors } from '@/api/statistics/anchor.ts'
import { ListRequest } from '@/api/statistics/summary.ts'
import { getFallback } from '@/utils/avatar.ts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function TopAnchors() {
  const end = DateTime.now().startOf('hour')
  const begin = end.minus({ hours: 12 })
  const param: ListRequest = {
    begin: begin.toISO(),
    end: end.toISO(),
    limit: 12,
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
              {anchor.broadcastAmount} - {anchor.broadcastDuration}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

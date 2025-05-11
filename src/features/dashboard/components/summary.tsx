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
  const dailySummary = useDailySummary(date)
  const prevDailySummary = useDailySummary(getPrevDate(date))

  if (!dailySummary.isFetched || !prevDailySummary.isFetched) {
    return <>Loading...</>
  }

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Anchor Amount</CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='text-muted-foreground h-4 w-4'
          >
            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {dailySummary.data?.anchorAmount}
          </div>
          <p className='text-muted-foreground text-xs'>
            {dailySummary.data!.anchorAmount -
              prevDailySummary.data!.anchorAmount}{' '}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Game Amount</CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='text-muted-foreground h-4 w-4'
          >
            <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
            <circle cx='9' cy='7' r='4' />
            <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {dailySummary.data?.gameAmount}
          </div>
          <p className='text-muted-foreground text-xs'>
            {dailySummary.data!.gameAmount - prevDailySummary.data!.gameAmount}{' '}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Broadcast Amount
          </CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='text-muted-foreground h-4 w-4'
          >
            <rect width='20' height='14' x='2' y='5' rx='2' />
            <path d='M2 10h20' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {dailySummary.data?.broadcastAmount}
          </div>
          <p className='text-muted-foreground text-xs'>
            {dailySummary.data!.broadcastAmount -
              prevDailySummary.data!.broadcastAmount}{' '}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Broadcast Duration
          </CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='text-muted-foreground h-4 w-4'
          >
            <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {dailySummary.data?.broadcastDuration}
          </div>
          <p className='text-muted-foreground text-xs'>
            {dailySummary.data!.broadcastDuration -
              prevDailySummary.data!.broadcastDuration}{' '}
            since last hour
          </p>
        </CardContent>
      </Card>
    </>
  )
}
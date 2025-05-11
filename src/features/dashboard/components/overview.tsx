import { DateTime } from 'luxon'
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ListRequest,
  SummaryDate,
  useHourlySummary,
} from '@/api/statistics/summary.ts'

export type OverviewProps = {
  date: SummaryDate
}

export function Overview({ date }: OverviewProps) {
  const end =
    date === 'today'
      ? DateTime.now().startOf('hour')
      : DateTime.now().startOf('hour').minus({ day: 1 })
  const begin = end.minus({ hours: 12 })

  const param: ListRequest = {
    begin: begin.toISO(),
    end: end.toISO(),
    limit: 12,
  }

  const hourlySummaries = useHourlySummary(param)

  if (!hourlySummaries.isFetched) {
    return <p>Loading</p>
  }

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={hourlySummaries.data}>
        <XAxis
          dataKey='createdAt'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Legend />
        <Bar
          dataKey='anchorAmount'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
          label='Total'
        />
        <Bar
          dataKey='broadcastAmount'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-secondary'
          label='Min'
        />
        <Bar
          dataKey='broadcastDuration'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-secondary'
          label='Min'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

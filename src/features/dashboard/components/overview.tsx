import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'
import {
  ListRequest,
  SummaryDate,
  useHourlySummary,
} from '@/api/statistics/summary.ts'
import { translateSeconds } from '@/utils/time'

export type OverviewProps = {
  date: SummaryDate
}

function MyTooltip<TValue extends ValueType, TName extends NameType>({
  payload,
  label,
  active,
}: TooltipProps<TValue, TName>) {
  const { t } = useTranslation()
  const date = new Date(label)

  if (active) {
    return (
      <div className='bg-primary rounded-lg border-1 p-6'>
        <p className='text-primary-foreground'>{`${date.toLocaleString()}`}</p>
        <ul className='text-secondary dark:text-secondary-foreground text-xs'>
          {payload!.map((p) => (
            <li key={p.dataKey}>
              {t(`apps.dashboard.recharts.${p.dataKey}`)}:&nbsp;
              {p.dataKey === 'broadcastDuration'
                ? translateSeconds(p.payload[p.dataKey!], t)
                : p.payload[p.dataKey!]}
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    return null
  }
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
          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
        />
        <YAxis
          stroke='#888888'
          yAxisId='anchor'
          hide
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <YAxis
          stroke='#888888'
          yAxisId='game'
          hide
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <YAxis
          stroke='#888888'
          yAxisId='amount'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <YAxis
          stroke='#888888'
          hide
          yAxisId='duration'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip content={<MyTooltip />} />
        <Bar
          dataKey='anchorAmount'
          yAxisId='anchor'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
          label='Total'
        />
        <Bar
          dataKey='gameAmount'
          yAxisId='game'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-secondary'
          label='Game'
        />
        <Bar
          dataKey='broadcastAmount'
          yAxisId='amount'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
          label='Min'
        />
        <Bar
          dataKey='broadcastDuration'
          yAxisId='duration'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-secondary'
          label='Min'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

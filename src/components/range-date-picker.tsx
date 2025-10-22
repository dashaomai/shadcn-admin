import { useEffect, useMemo, useState } from 'react'
import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { ChevronDownIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { dateEqual, getBeginOfMonth, getBeginOfWeek, getToday } from '@/utils/time.ts';
import { Button } from '@/components/ui/button.tsx';
import { Calendar } from '@/components/ui/calendar.tsx';
import { useRangeDate } from '@/components/context/range-date-context.tsx'


export function RangeDatePicker() {
  const { t } = useTranslation()

  const { begin, setBegin, end, setEnd } = useRangeDate()

  const today = useMemo(() => getToday(), [])
  const tomorrow = useMemo(() => addDays(today, 1), [today])
  const yesterday = useMemo(() => subDays(today, 1), [today])

  const [open, setOpen] = useState(false)

  const beginOfThisWeek = useMemo(() => getBeginOfWeek(today), [today])
  const beginOfNextWeek = useMemo(() => addWeeks(beginOfThisWeek, 1), [beginOfThisWeek])
  const beginOfLastWeek = useMemo(() => subWeeks(beginOfThisWeek, 1), [beginOfThisWeek])

  const beginOfThisMonth = useMemo(() => getBeginOfMonth(today), [today])
  const beginOfNextMonth = useMemo(() => addMonths(beginOfThisMonth, 1), [beginOfThisMonth])
  const beginOfLastMonth = useMemo(() => subMonths(beginOfThisMonth, 1), [beginOfThisMonth])

  function isToday(): boolean {
    return dateEqual(begin, today) && dateEqual(end, tomorrow)
  }

  function isYesterday(): boolean {
    return dateEqual(begin, yesterday) && dateEqual(end, today)
  }

  function isThisWeek(): boolean {
    return dateEqual(begin, beginOfThisWeek) && dateEqual(end, beginOfNextWeek)
  }

  function isLastWeek(): boolean {
    return dateEqual(begin, beginOfLastWeek) && dateEqual(end, beginOfThisWeek)
  }

  function isThisMonth(): boolean {
    return dateEqual(begin, beginOfThisMonth) && dateEqual(end, beginOfNextMonth)
  }

  function isLastMonth(): boolean {
    return dateEqual(begin, beginOfLastMonth) && dateEqual(end, beginOfThisMonth)
  }

  useEffect(() => {
    console.log(today)
    console.log(isToday())
  }, [begin, end])

  return (
    <div className='flex items-center justify-center gap-1'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            id='begin'
            className='w-auto justify-between font-normal'
            >
            {begin?.toLocaleDateString()} {t('common.time.to')} {end?.toLocaleDateString()}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto overflow-hidden p-0 z-50' align='start'>
          <Calendar
            required
            className='bg-white border border-gray-200 rounded-lg'
            mode='range'
            selected={{from: begin, to: end}}
            captionLayout='label'
            onSelect={(dates: DateRange) => {
              if (dates.from) {
                dates.from.setHours(0, 0, 0, 0)
                setBegin(dates.from)
              }

              if (dates.to) {
                dates.to.setHours(0, 0, 0, 0)
                setEnd(dates.to)
              }
            }}
          />

        </PopoverContent>
      </Popover>
      <Button
        variant={isYesterday() ? 'default' : 'secondary'}
        onClick={() => {
          setBegin(yesterday)
          setEnd(today)
        }}
      >{t('common.time.yesterday')}</Button>
      <Button
        variant={isToday() ? 'default' : 'secondary'}
        onClick={() => {
          setBegin(today)
          setEnd(tomorrow)
        }}
      >{t('common.time.today')}</Button>
      <Button
        variant={isLastWeek() ? 'default' : 'secondary'}
        onClick={() => {
          setBegin(beginOfLastWeek)
          setEnd(beginOfThisWeek)
        }}
      >{t('common.time.lastWeek')}</Button>
      <Button
        variant={isThisWeek() ? 'default' : 'secondary'}
        onClick={() => {
          setBegin(beginOfThisWeek)
          setEnd(beginOfNextWeek)
        }}
      >{t('common.time.thisWeek')}</Button>
      <Button
        variant={isLastMonth() ? 'default' : 'secondary'}
        onClick={() => {
          setBegin(beginOfLastMonth)
          setEnd(beginOfThisMonth)
        }}
      >{t('common.time.lastMonth')}</Button>
      <Button
        variant={isThisMonth() ? 'default' : 'secondary'}
        onClick={() => {
          setBegin(beginOfThisMonth)
          setEnd(beginOfNextMonth)
        }}
      >{t('common.time.thisMonth')}</Button>
    </div>
  )
}
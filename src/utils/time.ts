import {
  formatDate,
  startOfMonth,
  startOfWeek,
} from 'date-fns'


const day: number = 24 * 3600
const hour: number = 3600
const minute: number = 60

export type TimeMeta = {
  positive: boolean
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const secondToTime = (seconds: number): TimeMeta => {
  const positive = seconds >= 0
  if (!positive) {
    seconds = -seconds
  }

  const days = Math.floor(seconds / day)
  seconds %= day
  seconds = Math.abs(seconds)
  const hours = Math.floor(seconds / hour)
  seconds %= hour
  const minutes = Math.floor(seconds / minute)
  seconds %= minute

  return {
    positive,
    days,
    hours,
    minutes,
    seconds,
  }
}

export type MarkOfTime = 'day' | 'hour' | 'minute' | 'second'

export const getMarkOfTime = (meta: TimeMeta): MarkOfTime => {
  if (meta.days !== 0) {
    return 'day'
  } else if (meta.hours !== 0) {
    return 'hour'
  } else if (meta.minutes !== 0) {
    return 'minute'
  } else {
    return 'second'
  }
}

export const translateSeconds = (
  seconds: number,
  t: (key: string, meta: TimeMeta) => string
): string => {
  const meta = secondToTime(seconds)
  const mark = getMarkOfTime(meta)
  return t(`common.time.${meta.positive ? 'positive' : 'negative'}.${mark}`, meta)
}

export const getToday = (): Date => {
  let today = new Date()
  today.setHours(0, 0, 0, 0)

  return today
}

export const getBeginOfWeek = (date: Date): Date => {
  return startOfWeek(date)
}

export const getBeginOfMonth = (date: Date): Date => {
  return startOfMonth(date)
}

export const dateEqual = (a: Date, b: Date): boolean => {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export const formatToDateOnly = (date: Date): string => formatDate(date, 'yyyy-MM-dd')
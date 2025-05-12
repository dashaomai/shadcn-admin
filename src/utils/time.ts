const day: number = 24 * 3600
const hour: number = 3600
const minute: number = 60

export type TimeMeta = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const secondToTime = (seconds: number): TimeMeta => {
  const days = Math.floor(seconds / day)
  seconds %= day
  const hours = Math.floor(seconds / hour)
  seconds %= hour
  const minutes = Math.floor(seconds / minute)
  seconds %= minute

  return {
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

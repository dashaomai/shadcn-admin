import Long from 'long'

export const currencyToString = (value?: string): string => {
  if (!value) {
    return '0.0'
  }

  const original = Long.fromString(value)

  const first = original.div(100)

  const head = first.div(100)
  const tail = first.mod(100)

  return `${head}.${tail}`
}
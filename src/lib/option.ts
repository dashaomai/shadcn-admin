import React, { Dispatch, SetStateAction } from 'react'

export type SelectOption<O> = {
  label: string
  value: O
  icon?: React.ComponentType<{ className?: string }>
}

export type FilterProps<O> = {
  values: O[]
  setValues: Dispatch<SetStateAction<O[]>>
}

import React from 'react'

export type ListAppsDialogType = 'add' | 'edit' | 'delete'

export interface ListAppsContextType<T, E> {
  open: T | null
  setOpen: (str: T | null) => void
  currentRow: E | null
  setCurrentRow: React.Dispatch<React.SetStateAction<E | null>>
}

export const createContext = <T, E>() =>
  React.createContext<ListAppsContextType<T, E> | null>(null)

export interface ListAppsProps {
  children: React.ReactNode
}

import React, { ReactElement } from 'react'
import { Column, ColumnDef, Row, Table } from '@tanstack/react-table'
import { FilterFns } from '@tanstack/react-table'

export type ListAppsDialogType = 'create' | 'update' | 'delete'

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

export interface ListAppActionDialogProps<E> {
  currentRow?: E
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface ListAppsDeleteDialogProps<E> {
  currentRow: E
  open: boolean
  onOpenChange: (open: boolean) => void
}

export type DataTableProps<T> = {
  columns: ColumnDef<T>[]
  data: T[]
  page: number
  limit: number
  total: number
}

export type DataTableRowActionsProps<T> = {
  row: Row<T>
}

export type DataTableToolbarProps<T> = {
  table: Table<T>
  placeholder?: string
  children?: ReactElement
}

export type DataTableFacetedFilterProps<T, V, O> = {
  column?: Column<T, V>
  title?: string
  options: {
    label: string
    value: O
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export type DataTableViewOptions<T> = {
  table: Table<T>
}

export type DataTablePaginationProps<T> = {
  table: Table<T>
}

export const numberIn = <T>(
  row: Row<T>,
  columnId: string,
  filterValue: number[]
) => {
  if (!filterValue || !Array.isArray(filterValue)) return true

  const value = row.getValue<number>(columnId)
  return filterValue.indexOf(value) > -1
}

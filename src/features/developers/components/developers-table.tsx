import { useMemo, useState } from 'react'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { DataTableProps, numberIn } from '@/lib/list-app'
import { SelectOption } from '@/lib/option'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableFacetedFilter } from '@/features/table/components/table-faceted-filter'
import { TablePagination } from '@/features/table/components/table-pagination'
import { TableToolbar } from '@/features/table/components/table-toolbar'
import {
  DeveloperInfo,
  DeveloperStatusDescriptions,
  DeveloperTypeDescriptions,
} from '../data/developer'
import { useTranslation } from 'react-i18next'

type Props = DataTableProps<DeveloperInfo>

export function DevelopersTable({ columns, data, total }: Props) {
  const { t } = useTranslation()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    rowCount: total,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    filterFns: {
      numberIn,
    },
  })

  const allTypes = useMemo<SelectOption<number>[]>(
    () =>
      DeveloperTypeDescriptions.map((desc, i) => ({
        label: t(`apps.developers.properties.type.${desc}`),
        value: i,
      })),
    []
  )

  const allStatus = useMemo<SelectOption<number>[]>(
    () =>
      DeveloperStatusDescriptions.map((desc, i) => ({
        label: t(`apps.developers.properties.status.${desc}`),
        value: i,
      })),
    []
  )

  return (
    <div className='space-y-4'>
      <TableToolbar
        table={table}
        placeholder={t('apps.developers.toolbar.placeholder')}
      >
        <div className='flex gap-x-2'>
          {table.getColumn('type') && allTypes && (
            <TableFacetedFilter
              column={table.getColumn('type')}
              title={t('apps.developers.properties.type.title')}
              options={allTypes}
            />
          )}

          {table.getColumn('status') && allStatus && (
            <TableFacetedFilter
              column={table.getColumn('status')}
              title={t('apps.developers.properties.status.title')}
              options={allStatus}
            />
          )}
        </div>
      </TableToolbar>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.className ?? ''}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ''}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {t('common.data.no-results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination total={total} table={table} />
    </div>
  )
}

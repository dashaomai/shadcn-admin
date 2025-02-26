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
import { i18n } from '@/lib/i18n'
import { DataTableProps } from '@/lib/list-app'
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
  PlatformInfo,
  PlatformStatusDescriptions,
  PlatformTypeDescriptions,
} from '../data/platform'

type Props = DataTableProps<PlatformInfo>

export function PlatformsTable({ columns, data, total }: Props) {
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
  })

  const allTypes = useMemo<SelectOption[]>(
    () =>
      PlatformTypeDescriptions.map((desc, i) => ({
        label: i18n.t(`apps.platforms.properties.type.${desc}`),
        value: String(i),
      })),
    []
  )

  const allStatus = useMemo<SelectOption[]>(
    () =>
      PlatformStatusDescriptions.map((desc, i) => ({
        label: i18n.t(`apps.platforms.properties.status.${desc}`),
        value: String(i),
      })),
    []
  )

  return (
    <div className='space-y-4'>
      <TableToolbar
        table={table}
        placeholder={i18n.t('apps.platforms.toolbar.placeholder')}
      >
        <div className='flex gap-x-2'>
          {table.getColumn('type') && allTypes && (
            <TableFacetedFilter
              column={table.getColumn('type')}
              title={i18n.t('apps.platforms.properties.type.title')}
              options={allTypes}
            />
          )}

          {table.getColumn('status') && allStatus && (
            <TableFacetedFilter
              column={table.getColumn('status')}
              title={i18n.t('apps.platforms.properties.status.title')}
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
                  {i18n.t('common.data.no-results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />
    </div>
  )
}

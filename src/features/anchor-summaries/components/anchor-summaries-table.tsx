import { useEffect, useState } from 'react'
import { ColumnFiltersState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useAllGames } from '@/api/bridge/game.ts';
import { DataTableProps } from '@/lib/list-app.ts';
import { SelectOption } from '@/lib/option.ts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { AnchorSummary } from '@/features/anchor-summaries/data/anchor-summary.ts';
import { TableFacetedFilter } from '@/features/table/components/table-faceted-filter.tsx';
import { TablePagination } from '@/features/table/components/table-pagination.tsx';
import { TableToolbar } from '@/features/table/components/table-toolbar.tsx';
import { RangeDatePicker } from '@/components/range-date-picker.tsx'


type Props = DataTableProps<AnchorSummary>

export function AnchorSummariesTable({ columns, data, total }: Props) {
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
  })

  const allGames = useAllGames()

  const [gameOptions, setGameOptions] = useState<SelectOption<string>[] | undefined>([])

  useEffect(() => {
    if (allGames.isFetched) {
      const options = allGames.data?.map(game => ({
        label: game.description,
        value: game.name,
      }))

      setGameOptions(options)
    }
  }, [allGames.isFetched, setGameOptions])

  return (
    <div className='space-y-4'>
      <TableToolbar
        table={table}
        placeholder={t('apps.anchorSummaries.toolbar.placeholder')}
      >
        <div className='flex gap-x-2'>
          <RangeDatePicker />
          {table.getColumn('lastGame') && gameOptions && (
            <TableFacetedFilter
              column={table.getColumn('lastGame')}
              title={t('apps.anchorSummaries.properties.lastGame.title')}
              options={gameOptions}
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

      <TablePagination table={table} />
    </div>
  )
}
import { useEffect, useState } from 'react';
import { ColumnFiltersState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useAllAnchors } from '@/api/bridge/anchor.ts';
import { useAllGames } from '@/api/bridge/game.ts';
import { DataTableProps } from '@/lib/list-app.ts';
import { SelectOption } from '@/lib/option.ts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { useAnchorFilter } from '@/components/context/anchor-filter-context.tsx';
import { useGameFilter } from '@/components/context/game-filter-context.tsx';
import { RangeDatePicker } from '@/components/range-date-picker.tsx';
import { Broadcast } from '@/features/broadcasts/data/broadcast.ts';
import { TableFacetedFilter } from '@/features/table/components/table-faceted-filter.tsx'
import { TablePagination } from '@/features/table/components/table-pagination.tsx'
import { TableToolbar } from '@/features/table/components/table-toolbar.tsx';


type Props = DataTableProps<Broadcast>

export function BroadcastsTable({ columns, data, total }: Props) {
  const { t } = useTranslation()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const { values: gameIds, setValues: setGameIds } = useGameFilter()
  const { values: anchorIds, setValues: setAnchorIds } = useAnchorFilter()

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

  const onReset = () => {
    setGameIds([])
    setAnchorIds([])
  }

  const gameColumn = table.getColumn('gameId')
  const anchorColumn = table.getColumn('anchorId')

  useEffect(() => {
    gameColumn?.setFilterValue(gameIds)
  }, [gameColumn, gameIds])

  useEffect(() => {
    anchorColumn?.setFilterValue(anchorIds)
  }, [anchorColumn, anchorIds])

  const allGames = useAllGames()
  const [gameOptions, setGameOptions] = useState<SelectOption<number>[]>([])

  const allAnchors = useAllAnchors()
  const [anchorOptions, setAnchorOptions] = useState<SelectOption<string>[]>([])

  useEffect(() => {
    if (allGames.isFetched) {
      const options = allGames.data?.map(game => ({
        label: t(`apps.games.name.${game.name}`),
        value: game.id,
      }))

      if (options)
        setGameOptions(options)
    }
  }, [allGames.isFetched, setGameOptions])

  useEffect(() => {
    if (allAnchors.isFetched) {
      const options = allAnchors.data?.map(anchor => ({
        label: anchor.nickname,
        value: anchor.id,
      }))

      if (options)
        setAnchorOptions(options)
    }
  }, [allAnchors.isFetched, setAnchorOptions])

  return (
    <div className='space-y-4'>
      <TableToolbar
        disableQuickFilter={true}
        onReset={onReset}
        table={table}
        placeholder={t('apps.broadcasts.toolbar.placeholder')}
      >
        <div className='flex gap-x-2'>
          <RangeDatePicker />
          {gameColumn && gameOptions && gameOptions.length > 0 && (
            <TableFacetedFilter
              column={gameColumn}
              title={t('apps.broadcasts.properties.game.title')}
              options={gameOptions}
              setFilterValues={setGameIds}
            />
          )}
          {
            anchorColumn && anchorOptions && anchorOptions.length > 0 && (
              <TableFacetedFilter
                column={anchorColumn}
                title={t('apps.broadcasts.properties.anchor.title')}
                options={anchorOptions}
                setFilterValues={setAnchorIds}
              />
            )
          }
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
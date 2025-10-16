import { useEffect, useState } from 'react'
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
import { useTranslation } from 'react-i18next'
import { useAllAnchors } from '@/api/bridge/anchor.ts'
import { AccountStatus } from '@/lib/auth.ts'
import { DataTableProps } from '@/lib/list-app.ts'
import { SelectOption } from '@/lib/option.ts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { useAccountStatusFilter } from '@/components/context/account-status-filter-context.tsx'
import { useAnchorFilter } from '@/components/context/anchor-filter-context.tsx'
import { useSpecialStatusFilter } from '@/components/context/special-status-filter-context.tsx'
import {
  AnchorConfiguration,
  SpecialStatus,
} from '@/features/anchors/data/anchor-info.ts'
import { TableFacetedFilter } from '@/features/table/components/table-faceted-filter.tsx'
import { TablePagination } from '@/features/table/components/table-pagination.tsx'
import { TableToolbar } from '@/features/table/components/table-toolbar.tsx'

type Props = DataTableProps<AnchorConfiguration>

export function AnchorsTable({ columns, data, total }: Props) {
  const { t } = useTranslation()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const { values: anchorIds, setValues: setAnchorIds } = useAnchorFilter()
  const { values: accountStatusFilter, setValues: setAccountStatusFilter } =
    useAccountStatusFilter()
  const { values: specialStatusFilter, setValues: setSpecialStatusFilter } =
    useSpecialStatusFilter()

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
    setAnchorIds([])
    setAccountStatusFilter([])
    setSpecialStatusFilter([])
  }

  const allAccountStatus: SelectOption<AccountStatus>[] = [
    {
      label: t('common.accounts.properties.status.0'),
      value: AccountStatus.Disabled,
    },
    {
      label: t('common.accounts.properties.status.1'),
      value: AccountStatus.Enabled,
    },
  ]
  const allSpecialStatus: SelectOption<SpecialStatus>[] = [
    {
      label: t('common.anchors.properties.specialStatus.0'),
      value: SpecialStatus.Normal,
    },
    {
      label: t('common.anchors.properties.specialStatus.1'),
      value: SpecialStatus.Top,
    },
  ]

  const anchorColumn = table.getColumn('id')
  const accountStatusColumn = table.getColumn('status')
  const specialStatusColumn = table.getColumn('specialStatus')

  useEffect(() => {
    anchorColumn?.setFilterValue(anchorIds)
  }, [anchorColumn, anchorIds])

  useEffect(() => {
    accountStatusColumn?.setFilterValue(accountStatusFilter)
  }, [accountStatusColumn, accountStatusFilter])

  useEffect(() => {
    specialStatusColumn?.setFilterValue(specialStatusFilter)
  }, [specialStatusColumn, specialStatusFilter])

  const allAnchors = useAllAnchors()
  const [anchorOptions, setAnchorOptions] = useState<SelectOption<string>[]>([])

  useEffect(() => {
    if (allAnchors.isFetched) {
      const options = allAnchors.data?.map((anchor) => ({
        label: anchor.nickname,
        value: anchor.id,
      }))

      if (options) setAnchorOptions(options)
    }
  }, [allAnchors.isFetched, setAnchorOptions])

  return (
    <div className='space-y-4'>
      <TableToolbar
        disableQuickFilter={true}
        onReset={onReset}
        table={table}
        placeholder={t('apps.anchors.toolbar.placeholder')}
      >
        <div className='flex gap-x-2'>
          {anchorColumn && anchorOptions && anchorOptions.length > 0 && (
            <TableFacetedFilter
              column={anchorColumn}
              title={t('apps.anchors.properties.anchor.title')}
              options={anchorOptions}
              setFilterValues={setAnchorIds}
            />
          )}
          <TableFacetedFilter
            column={accountStatusColumn}
            title={t('apps.anchors.properties.status.title')}
            options={allAccountStatus}
            setFilterValues={setAccountStatusFilter}
          />
          <TableFacetedFilter
            column={specialStatusColumn}
            title={t('apps.anchors.properties.specialStatus.title')}
            options={allSpecialStatus}
            setFilterValues={setSpecialStatusFilter}
          />
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

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { useRouter, useSearch } from '@tanstack/react-router'
import { i18n } from '@/lib/i18n.ts'
import { DataTablePaginationProps } from '@/lib/list-app.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'

export function TablePagination<T>({ table }: DataTablePaginationProps<T>) {
  const router = useRouter()
  const pathname = router.latestLocation.pathname

  const { page, limit } = useSearch({
    strict: false,
  })

  const total = table.getRowCount()
  const maxPage = Math.ceil(Number(total) / Number(limit))
  const canPreviousPage = Number(page) > 1
  const canNextPage = Number(page) < maxPage

  function gotoPage(
    pageIndex: number | string | undefined,
    theLimit: number | string | undefined
  ) {
    router.history.push(
      `${pathname}?page=${pageIndex ?? 0}&limit=${theLimit ?? 10}`
    )
  }

  return (
    <div
      className='flex items-center justify-between overflow-clip px-2'
      style={{ overflowClipMargin: 1 }}
    >
      <div className='hidden flex-1 text-sm text-muted-foreground sm:block'>
        {i18n.t('apps.table.pagination.selected', {
          selected: table.getFilteredSelectedRowModel().rows.length,
          count: table.getFilteredRowModel().rows.length,
        })}
      </div>
      <div className='flex items-center sm:space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='hidden text-sm font-medium sm:block'>
            {i18n.t('apps.table.pagination.rows')}
          </p>
          <Select
            value={`${Number(limit)}`}
            onValueChange={(value) => gotoPage(page, value)}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={Number(limit)} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 15, 20, 30, 50].map((limit) => (
                <SelectItem key={limit} value={`${limit}`}>
                  {limit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          {i18n.t('apps.table.pagination.page', {
            page,
            maxPage,
          })}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => gotoPage(1, limit)}
            disabled={!canPreviousPage}
          >
            <span className='sr-only'>
              {i18n.t('apps.table.pagination.first-page')}
            </span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => gotoPage(Number(page) - 1, limit)}
            disabled={!canPreviousPage}
          >
            <span className='sr-only'>
              {i18n.t('apps.table.pagination.prev-page')}
            </span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => gotoPage(Number(page) + 1, limit)}
            disabled={!canNextPage}
          >
            <span className='sr-only'>
              {i18n.t('apps.table.pagination.next-page')}
            </span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => gotoPage(maxPage, limit)}
            disabled={!canNextPage}
          >
            <span className='sr-only'>
              {i18n.t('apps.table.pagination.last-page')}
            </span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
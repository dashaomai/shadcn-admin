import { useEffect, useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { DataTableToolbarProps } from '@/lib/list-app.ts'
import { Role } from '@/lib/role.ts'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { TableViewOptions } from '@/features/roles/components/table-view-options.tsx'

export function TableToolbar({
  children,
  placeholder,
  table,
}: DataTableToolbarProps<Role>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    table.setGlobalFilter(filter)
  }, [filter, table])

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder={placeholder}
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />

        {children}

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>

      <TableViewOptions table={table} />
    </div>
  )
}
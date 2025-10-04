import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { ChevronDownIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button.tsx';
import { Calendar } from '@/components/ui/calendar.tsx';


export function RangeDatePicker() {
  const [open, setOpen] = useState(false)
  const [begin, setBegin] = useState<Date | undefined>(new Date())
  const [end, setEnd] = useState<Date | undefined>()

  return (
    <div className='flex items-center justify-center gap-1'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            id='begin'
            className='w-54 justify-between font-normal'
            >
            {begin?.toLocaleDateString()} - {end?.toLocaleDateString()}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto overflow-hidden p-0 z-10' align='start'>
          <Calendar
            required
            className='bg-white border border-gray-200 rounded-lg'
            mode='range'
            selected={{from: begin, to: end}}
            captionLayout='label'
            onSelect={(dates: DateRange) => {
              if (dates.from) {
                setBegin(dates.from)
              }

              if (dates.to) {
                setEnd(dates.to)
              }
            }}
          />

        </PopoverContent>
      </Popover>
      <Button variant='outline'>Yesterday</Button>
      <Button variant='default'>Today</Button>
      <Button variant='secondary'>Last Week</Button>
      <Button variant='default'>This Week</Button>
      <Button variant='default'>Last Month</Button>
      <Button variant='default'>This Month</Button>
    </div>
  )
}
import { Button } from '@/components/ui/button.tsx'
import { DownloadIcon } from 'lucide-react'

export function AnchorSummariesPrimaryButtons() {

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={e => e.preventDefault()}>
        <span>Download</span>
        <DownloadIcon />
      </Button>
    </div>
  )
}
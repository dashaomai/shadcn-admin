import { Button } from '@/components/ui/button.tsx'
import { DownloadIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AnchorSummariesPrimaryButtons() {
  const { t } = useTranslation()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={e => e.preventDefault()}>
        <span>{t('apps.anchorSummaries.export')}</span>
        <DownloadIcon />
      </Button>
    </div>
  )
}
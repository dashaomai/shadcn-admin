import { useAccounts } from '@/features/accounts/context/accounts-context.tsx'
import { Button } from '@/components/ui/button.tsx'
import { IconUserPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function AccountsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useAccounts()

  return(
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t('apps.accounts.create.title')}</span>
        <IconUserPlus size={18} />
      </Button>
    </div>
  )
}
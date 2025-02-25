import { useAccounts } from '@/features/accounts/context/accounts-context.tsx'
import { Button } from '@/components/ui/button.tsx'
import { IconUserPlus } from '@tabler/icons-react'
import { i18n } from '@/lib/i18n'

export function AccountsPrimaryButtons() {
  const { setOpen } = useAccounts()

  return(
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{i18n.t('apps.accounts.create.title')}</span>
        <IconUserPlus size={18} />
      </Button>
    </div>
  )
}
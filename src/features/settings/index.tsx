import { Outlet } from '@tanstack/react-router'
import { IconPalette, IconUser } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import MainHeader from '@/components/layout/main-header'
import SidebarNav from './components/sidebar-nav'

export default function Settings() {
  const { t } = useTranslation()

  return (
    <>
      {/* ===== Top Heading ===== */}
      <MainHeader inner={true} />

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('layout.navigate.items.settings')}
          </h1>
          <p className='text-muted-foreground'>
            {t('layout.navigate.items.settings-description')}
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'layout.navigate.items.profile',
    icon: <IconUser size={18} />,
    href: '/settings',
  },
  {
    title: 'layout.navigate.items.appearance',
    icon: <IconPalette size={18} />,
    href: '/settings/appearance',
  },
]

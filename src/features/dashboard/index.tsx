import { useTranslation } from 'react-i18next'
import { i18n } from '@/lib/i18n.ts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import SummaryCards from '@/features/dashboard/components/summary.tsx'
import { Overview } from './components/overview'
import { TopAnchors } from './components/top-anchors.tsx'

export default function Dashboard() {
  const { t } = useTranslation()

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('apps.dashboard.title')}
          </h1>
          <div className='flex items-center space-x-2'></div>
        </div>
        <Tabs orientation='vertical' defaultValue='today' className='space-y-4'>
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='today'>
                {t('apps.dashboard.today.title')}
              </TabsTrigger>
              <TabsTrigger value='yesterday'>
                {t('apps.dashboard.yesterday.title')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='today' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <SummaryCards date='today' />
            </div>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>{t('apps.dashboard.today.overview')}</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview date='today' />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>{t('apps.dashboard.top-anchors.title')}</CardTitle>
                  <CardDescription>
                    {t('apps.dashboard.top-anchors.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopAnchors date='today' />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='yesterday' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <SummaryCards date='yesterday' />
            </div>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>
                    {t('apps.dashboard.yesterday.overview')}
                  </CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview date='yesterday' />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>{t('apps.dashboard.top-anchors.title')}</CardTitle>
                  <CardDescription>
                    {t('apps.dashboard.top-anchors.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopAnchors date='yesterday' />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: i18n.t('apps.dashboard.overview'),
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
]

import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { listPlatforms } from '@/api/system/platform'
import { Main } from '@/components/layout/main'
import MainContent from '@/components/layout/main-content'
import MainHeader from '@/components/layout/main-header'
import MainTitleBar from '@/components/layout/main-title-bar'
import { columns } from './components/platforms-columns'
import { PlatformsDialogs } from './components/platforms-dialogs'
import { PlatformsPrimaryButtons } from './components/platforms-primary-buttons'
import { PlatformsTable } from './components/platforms-table'
import PlatformsProvider from './context/platforms-context'
import { useTranslation } from 'react-i18next'

export default function PlatformsPage() {
  const { t } = useTranslation()
  
  const routeApi = getRouteApi('/_authenticated/platforms/')
  const { page, limit } = routeApi.useSearch()

  const query = useQuery({
    queryKey: ['platforms-list', page, limit],
    queryFn: async () => await listPlatforms({ page, limit }),
  })

  return (
    <PlatformsProvider>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={t('layout.navigate.items.platform')}
          description={t('apps.platforms.description')}
        >
          <PlatformsPrimaryButtons />
        </MainTitleBar>
        <MainContent>
          {query.isFetched && query.data && (
            <PlatformsTable
              columns={columns}
              data={query.data.data}
              page={page}
              limit={limit}
              total={query.data.total}
            />
          )}
        </MainContent>
      </Main>

      <PlatformsDialogs />
    </PlatformsProvider>
  )
}

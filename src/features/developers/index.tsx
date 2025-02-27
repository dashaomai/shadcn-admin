import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { listDevelopers } from '@/api/system/developer'
import { i18n } from '@/lib/i18n'
import { Main } from '@/components/layout/main'
import MainContent from '@/components/layout/main-content'
import MainHeader from '@/components/layout/main-header'
import MainTitleBar from '@/components/layout/main-title-bar'
import { columns } from './components/developers-columns'
import { DevelopersDialogs } from './components/developers-dialogs'
import { DevelopersPrimaryButtons } from './components/developers-primary-buttons'
import { DevelopersTable } from './components/developers-table'
import DevelopersProvider from './context/developers-context'

export default function DevelopersPage() {
  const routeApi = getRouteApi('/_authenticated/developers/')
  const { page, limit } = routeApi.useSearch()

  const query = useQuery({
    queryKey: ['developers-list', page, limit],
    queryFn: async () => await listDevelopers({ page, limit }),
  })

  return (
    <DevelopersProvider>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={i18n.t('layout.navigate.items.developer')}
          description={i18n.t('apps.developers.description')}
        >
          <DevelopersPrimaryButtons />
        </MainTitleBar>

        <MainContent>
          {query.isFetched && query.data && (
            <DevelopersTable
              columns={columns}
              data={query.data.data}
              page={page}
              limit={limit}
              total={query.data.total}
            />
          )}
        </MainContent>
      </Main>

      <DevelopersDialogs />
    </DevelopersProvider>
  )
}

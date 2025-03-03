import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { listPublishers } from '@/api/system/publisher'
import { i18n } from '@/lib/i18n'
import { Main } from '@/components/layout/main'
import MainContent from '@/components/layout/main-content'
import MainHeader from '@/components/layout/main-header'
import MainTitleBar from '@/components/layout/main-title-bar'
import { columns } from './components/publishers-columns'
import { PublishersDialogs } from './components/publishers-dialogs'
import { PublishersPrimaryButtons } from './components/publishers-primary-buttons'
import { PublishersTable } from './components/publishers-table'
import PublishersProvider from './context/publisher-context'

export default function PublishersPage() {
  const routeApi = getRouteApi('/_authenticated/publishers/')
  const { page, limit } = routeApi.useSearch()

  const query = useQuery({
    queryKey: ['publishers-list', page, limit],
    queryFn: async () => await listPublishers({ page, limit }),
  })

  return (
    <PublishersProvider>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={i18n.t('layout.navigate.items.publisher')}
          description={i18n.t('apps.publishers.description')}
        >
          <PublishersPrimaryButtons />
        </MainTitleBar>

        <MainContent>
          {query.isFetched && query.data && (
            <PublishersTable
              columns={columns}
              data={query.data.data}
              page={page}
              limit={limit}
              total={query.data.total}
            />
          )}
        </MainContent>
      </Main>

      <PublishersDialogs />
    </PublishersProvider>
  )
}

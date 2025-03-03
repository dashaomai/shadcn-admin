import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { listTags } from '@/api/system/tag'
import { i18n } from '@/lib/i18n'
import { Main } from '@/components/layout/main'
import MainContent from '@/components/layout/main-content'
import MainHeader from '@/components/layout/main-header'
import MainTitleBar from '@/components/layout/main-title-bar'
import { columns } from './components/tags-columns'
import { TagsDialogs } from './components/tags-dialogs'
import { TagsPrimaryButtons } from './components/tags-primary-buttons'
import { TagsTable } from './components/tags-table'
import TagsProvider from './context/tags-context'

export default function TagsPage() {
  const routeApi = getRouteApi('/_authenticated/tags/')
  const { page, limit } = routeApi.useSearch()

  const query = useQuery({
    queryKey: ['tags-list', page, limit],
    queryFn: async () => await listTags({ page, limit }),
  })

  return (
    <TagsProvider>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={i18n.t('layout.navigate.items.tag')}
          description={i18n.t('apps.tags.description')}
        >
          <TagsPrimaryButtons />
        </MainTitleBar>

        <MainContent>
          {query.isFetched && query.data && (
            <TagsTable
              columns={columns}
              data={query.data.data}
              page={page}
              limit={limit}
              total={query.data.total}
            />
          )}
        </MainContent>
      </Main>

      <TagsDialogs />
    </TagsProvider>
  )
}

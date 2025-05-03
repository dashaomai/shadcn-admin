import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { listTables } from '@/api/bridge/table.ts'
import { i18n } from '@/lib/i18n.ts'
import MainContent from '@/components/layout/main-content.tsx'
import MainHeader from '@/components/layout/main-header.tsx'
import MainTitleBar from '@/components/layout/main-title-bar.tsx'
import { Main } from '@/components/layout/main.tsx'
import { columns } from '@/features/tables/components/tables-columns.tsx'
import { TablesPrimaryButtons } from '@/features/tables/components/tables-primary-buttons.tsx'
import { TablesTable } from '@/features/tables/components/tables-table.tsx'
import TablesProvider from '@/features/tables/context/tables-context.tsx'

export default function TablesPage() {
  const routeApi = getRouteApi('/_authenticated/tables/')
  const { gameId, page, limit } = routeApi.useSearch()

  const query = useQuery({
    queryKey: ['tables-list', gameId, page, limit],
    queryFn: async () => await listTables({ gameId, page, limit }),
  })

  return (
    <TablesProvider>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={i18n.t('layout.navigate.items.game-catalog')}
          description={i18n.t('apps.game-catalogs.description')}
        >
          <TablesPrimaryButtons />
        </MainTitleBar>

        <MainContent>
          {query.isFetched && query.data && (
            <TablesTable
              columns={columns}
              data={query.data.data}
              page={page}
              limit={limit}
              total={query.data.total}
            />
          )}
        </MainContent>
      </Main>
    </TablesProvider>
  )
}
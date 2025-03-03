import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { listGameCatalogs } from '@/api/system/game-catalog'
import { i18n } from '@/lib/i18n'
import { Main } from '@/components/layout/main'
import MainContent from '@/components/layout/main-content'
import MainHeader from '@/components/layout/main-header'
import MainTitleBar from '@/components/layout/main-title-bar'
import { columns } from './components/game-catalogs-columns'
import { GameCatalogsDialogs } from './components/game-catalogs-dialogs'
import { GameCatalogsPrimaryButtons } from './components/game-catalogs-primary-buttons'
import { GameCatalogsTable } from './components/game-catalogs-table'
import GameCatalogsProvider from './context/game-catalogs-context'

export default function GameCatalogsPage() {
  const routeApi = getRouteApi('/_authenticated/game-catalogs/')
  const { page, limit } = routeApi.useSearch()

  const query = useQuery({
    queryKey: ['game-catalogs-list', page, limit],
    queryFn: async () => await listGameCatalogs({ page, limit }),
  })

  return (
    <GameCatalogsProvider>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={i18n.t('layout.navigate.items.game-catalog')}
          description={i18n.t('apps.game-catalogs.description')}
        >
          <GameCatalogsPrimaryButtons />
        </MainTitleBar>

        <MainContent>
          {query.isFetched && query.data && (
            <GameCatalogsTable
              columns={columns}
              data={query.data.data}
              page={page}
              limit={limit}
              total={query.data.total}
            />
          )}
        </MainContent>
      </Main>

      <GameCatalogsDialogs />
    </GameCatalogsProvider>
  )
}

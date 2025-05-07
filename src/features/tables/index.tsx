import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAllGames } from '@/api/bridge/game.ts'
import { listTables } from '@/api/bridge/table.ts'
import MainContent from '@/components/layout/main-content.tsx'
import MainHeader from '@/components/layout/main-header.tsx'
import MainTitleBar from '@/components/layout/main-title-bar.tsx'
import { Main } from '@/components/layout/main.tsx'
import { GameInfo } from '@/features/games/data/game.ts'
import { columns } from '@/features/tables/components/tables-columns.tsx'
import { TablesPrimaryButtons } from '@/features/tables/components/tables-primary-buttons.tsx'
import { TablesTable } from '@/features/tables/components/tables-table.tsx'
import TablesProvider from '@/features/tables/context/tables-context.tsx'

export default function TablesPage() {
  const { t } = useTranslation()
  const routeApi = getRouteApi('/_authenticated/tables/')
  const { gameId, page, limit } = routeApi.useSearch()

  const query = useQuery({
    queryKey: ['tables-list', gameId, page, limit],
    queryFn: async () => await listTables({ gameId, page, limit }),
  })

  const allGames = useAllGames()

  const [game, setGame] = useState<GameInfo | undefined>(undefined)

  useEffect(() => {
    if (allGames.isFetched) {
      const game = allGames.data?.find((value) => value.id === gameId)

      setGame(game)
    }
  }, [allGames.isFetched, setGame])

  return (
    <TablesProvider>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={
            game
              ? t(`apps.games.name.${game.name}`)
              : t('layout.navigate.items.table')
          }
          description={t('apps.tables.description')}
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
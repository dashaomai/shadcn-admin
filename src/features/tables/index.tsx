import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAllGames } from '@/api/bridge/game.ts'
import { useTableStore } from '@/stores/tableStore'
import MainContent from '@/components/layout/main-content.tsx'
import MainHeader from '@/components/layout/main-header.tsx'
import MainTitleBar from '@/components/layout/main-title-bar.tsx'
import { Main } from '@/components/layout/main.tsx'
import { GameInfo } from '@/features/games/data/game.ts'
import { columns } from '@/features/tables/components/tables-columns.tsx'
import { TablesPrimaryButtons } from '@/features/tables/components/tables-primary-buttons.tsx'
import { TablesTable } from '@/features/tables/components/tables-table.tsx'
import TablesProvider from '@/features/tables/context/tables-context.tsx'

export type Props = {
  gameId: number
  path: string
}

export default function TablesPage({ gameId, path }: Props) {
  const { t } = useTranslation()
  const routeApi = getRouteApi(path)
  const { page, limit } = routeApi.useSearch()

  const tableStore = useTableStore()

  const allGames = useAllGames()

  const [game, setGame] = useState<GameInfo | undefined>(undefined)

  useEffect(() => {
    if (allGames.isFetched) {
      const game = allGames.data?.find((value) => value.id === gameId)

      setGame(game)
    }
  }, [allGames.data, allGames.isFetched, gameId, setGame])

  useEffect(() => {
    tableStore.broadcast.setParams(gameId, page, limit)
  }, [gameId, page, limit])

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
          <TablesTable
            columns={columns}
            data={tableStore.broadcast.tables}
            page={page}
            limit={limit}
            total={tableStore.broadcast.total}
          />
        </MainContent>
      </Main>
    </TablesProvider>
  )
}

import { useTranslation } from 'react-i18next'
import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { pageListBroadcasts } from '@/api/statistics/broadcast.ts'
import { formatRFC3339 } from 'date-fns'
import { useAllGames } from '@/api/bridge/game.ts'
import { useAllAnchors } from '@/api/bridge/anchor.ts'
import RangeDateProvider from '@/components/context/range-date-context.tsx'
import GameFilterProvider from '@/components/context/game-filter-context.tsx'
import AnchorFilterProvider from '@/components/context/anchor-filter-context.tsx'
import MainHeader from '@/components/layout/main-header.tsx'
import { Main } from '@/components/layout/main.tsx'
import MainTitleBar from '@/components/layout/main-title-bar.tsx'
import MainContent from '@/components/layout/main-content.tsx'
import { columns } from '@/features/broadcasts/components/broadcasts-columns'
import { BroadcastsTable } from '@/features/broadcasts/components/broadcasts-table.tsx'
import { BroadcastsPrimaryButtons } from '@/features/broadcasts/components/broadcasts-primary-buttons.tsx'

export default function BroadcastsPage() {
  const { t } = useTranslation()
  const routeApi = getRouteApi('/_authenticated/broadcasts/')
  const { begin, end, page, limit, games, anchors } = routeApi.useSearch()

  const [be, setBe] = useState<Date>(new Date(begin))
  const [en, setEn] = useState<Date>(new Date(end))

  const [gameIds, setGameIds] = useState(games)
  const [anchorIds, setAnchorIds] = useState(anchors)

  const query = useQuery({
    queryKey: ['broadcasts-list', be, en, page, limit, gameIds, anchorIds],
    queryFn: async () => pageListBroadcasts({
      page, limit,
      begin: formatRFC3339(be),
      end: formatRFC3339(en),
      gameIds,
      anchorIds,
    })
  })

  const allGames = useAllGames()
  const allAnchors = useAllAnchors()

  return (
    <RangeDateProvider
      begin={be}
      setBegin={setBe}
      end={en}
      setEnd={setEn}
    >
      <GameFilterProvider values={gameIds} setValues={setGameIds}>
        <AnchorFilterProvider values={anchorIds} setValues={setAnchorIds}>

          <MainHeader />

          <Main>
            <MainTitleBar
              title={t('layout.navigate.items.broadcasts')}
              description={t('apps.broadcasts.description')}
            >
              <BroadcastsPrimaryButtons />
            </MainTitleBar>

            <MainContent>
              {query.isFetched && query.data && (
                <BroadcastsTable
                  columns={columns(allGames.data, allAnchors.data)}
                  data={query.data.data}
                  page={page}
                  limit={limit}
                  total={query.data.total}
                />
              )}
            </MainContent>
          </Main>

        </AnchorFilterProvider>
      </GameFilterProvider>
    </RangeDateProvider>
  )
}
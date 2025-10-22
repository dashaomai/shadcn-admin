import { useTranslation } from 'react-i18next'
import { getRouteApi } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import MainHeader from '@/components/layout/main-header.tsx'
import MainTitleBar from '@/components/layout/main-title-bar.tsx'
import MainContent from '@/components/layout/main-content.tsx'
import { Main } from '@/components/layout/main.tsx'
import {
  AnchorSummariesPrimaryButtons
} from '@/features/anchor-summaries/components/anchor-summaries-primary-buttons.tsx'
import { AnchorSummariesTable } from '@/features/anchor-summaries/components/anchor-summaries-table.tsx'
import { columns } from '@/features/anchor-summaries/components/anchor-summaries-columns.tsx'
import { useAllGames } from '@/api/bridge/game.ts'
import { useAllAnchors } from '@/api/bridge/anchor.ts'
import { pageListAnchorSummaries } from '@/api/statistics/anchor.ts'
import { formatRFC3339 } from 'date-fns'
import { useState } from 'react'
import RangeDateProvider from '@/components/context/range-date-context.tsx'
import GameFilterProvider from '@/components/context/game-filter-context.tsx'
import AnchorFilterProvider from '@/components/context/anchor-filter-context.tsx'

export default function AnchorSummariesPage() {
  const { t } = useTranslation()
  const routeApi = getRouteApi('/_authenticated/anchorSummaries/')
  const { begin, end, page, limit, games, anchors } = routeApi.useSearch()

  const [be, setBe] = useState<Date>(new Date(begin))
  const [en, setEn] = useState<Date>(new Date(end))

  const [gameIds, setGameIds] = useState(games)
  const [anchorIds, setAnchorIds] = useState(anchors)

  const query = useQuery({
    queryKey: ['anchorSummaries-list', be, en, page, limit],
    queryFn: async () => pageListAnchorSummaries({
      page, limit,
      begin: formatRFC3339(be),
      end: formatRFC3339(en),
      gameIds,
      anchorIds,
    }),
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
              title={t('layout.navigate.items.summaries')}
              description={t('apps.anchorSummaries.description')}
            >
              <AnchorSummariesPrimaryButtons />
            </MainTitleBar>

            <MainContent>
              {query.isFetched && query.data && (
                <AnchorSummariesTable
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
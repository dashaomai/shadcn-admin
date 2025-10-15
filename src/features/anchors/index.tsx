import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { pageListAnchors } from '@/api/statistics/anchor.ts'
import AnchorFilterProvider from '@/components/context/anchor-filter-context.tsx'
import MainContent from '@/components/layout/main-content.tsx'
import MainHeader from '@/components/layout/main-header.tsx'
import MainTitleBar from '@/components/layout/main-title-bar.tsx'
import { Main } from '@/components/layout/main.tsx'
import { columns } from '@/features/anchors/components/anchors-columns.tsx'
import { AnchorsPrimaryButtons } from '@/features/anchors/components/anchors-primary-buttons.tsx'
import { AnchorsTable } from '@/features/anchors/components/anchors-table.tsx'

export default function AnchorsPage() {
  const { t } = useTranslation()
  const routeApi = getRouteApi('/_authenticated/anchors/')
  const { page, limit, anchors } = routeApi.useSearch()

  const [anchorIds, setAnchorIds] = useState(anchors)

  const query = useQuery({
    queryKey: ['anchors-list', page, limit, anchorIds],
    queryFn: async () =>
      pageListAnchors({
        page,
        limit,
        anchorIds,
      }),
  })

  return (
    <AnchorFilterProvider values={anchorIds} setValues={setAnchorIds}>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={t('layout.navigate.items.anchors')}
          description={t('apps.anchors.description')}
        >
          <AnchorsPrimaryButtons />
        </MainTitleBar>

        <MainContent>
          {query.isFetched && query.data && (
            <AnchorsTable
              columns={columns}
              data={query.data.data}
              page={page}
              limit={limit}
              total={query.data.total}
            />
          )}
        </MainContent>
      </Main>
    </AnchorFilterProvider>
  )
}
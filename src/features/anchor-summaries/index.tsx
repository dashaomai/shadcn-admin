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

export default function AnchorSummariesPage() {
  const { t } = useTranslation()
  const routeApi = getRouteApi('/_authenticated/anchorSummaries/')
  const { page, limit } = routeApi.useSearch()

  const query = useQuery({
    queryKey: ['anchorSummaries-list', page, limit],
    queryFn: async () => ({data: [], total: 0}),
  })

  return (
    <>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={t('layout.navigate.items.account')}
          description={t('apps.accounts.description')}
        >
          <AnchorSummariesPrimaryButtons />
        </MainTitleBar>

        <MainContent>
          {query.isFetched && query.data && (
            <AnchorSummariesTable
              columns={columns}
              data={query.data.data}
              page={page}
              limit={limit}
              total={query.data.total}
            />
          )}
        </MainContent>
      </Main>
    </>
  )
}
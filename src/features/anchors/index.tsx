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
import AccountStatusFilterProvider from '@/components/context/account-status-filter-context.tsx'
import SpecialStatusFilterProvider from '@/components/context/special-status-filter-context.tsx'
import AnchorsProvider from '@/features/anchors/context/anchors-context.tsx'
import { useAllAnchors } from '@/api/bridge/anchor.ts'
import { AnchorsDialogs } from '@/features/anchors/components/anchors-dialogs.tsx'

export default function AnchorsPage() {
  const { t } = useTranslation()
  const routeApi = getRouteApi('/_authenticated/anchors/')
  const { page, limit, anchors, accountStatus, specialStatus } = routeApi.useSearch()

  const [anchorIds, setAnchorIds] = useState(anchors)
  const [accountStatusFilter, setAccountStatusFilter] = useState(accountStatus)
  const [specialStatusFilter, setSpecialStatusFilter] = useState(specialStatus)

  const query = useQuery({
    queryKey: ['anchors-list', page, limit],
    queryFn: async () =>
      pageListAnchors({
        page,
        limit,
        filteredAccountIds: anchorIds,
        filteredAccountStatus: accountStatusFilter,
        filteredSpecialStatus: specialStatusFilter,
      }),
  })

  const allAnchors = useAllAnchors()

  return (
    <AnchorsProvider>
      <AnchorFilterProvider values={anchorIds} setValues={setAnchorIds}>
        <AccountStatusFilterProvider values={accountStatusFilter} setValues={setAccountStatusFilter}>
          <SpecialStatusFilterProvider values={specialStatusFilter} setValues={setSpecialStatusFilter}>
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
                    columns={columns(allAnchors.data)}
                    data={query.data.data}
                    page={page}
                    limit={limit}
                    total={query.data.total}
                  />
                )}
              </MainContent>
            </Main>

            <AnchorsDialogs />
          </SpecialStatusFilterProvider>
        </AccountStatusFilterProvider>
      </AnchorFilterProvider>
    </AnchorsProvider>
  )
}
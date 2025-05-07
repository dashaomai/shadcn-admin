import { getRouteApi } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { listAccountInfos } from '@/api/auth.ts'
import AccountsProvider from '@/features/accounts/context/accounts-context.tsx'
import MainHeader from '@/components/layout/main-header.tsx'
import { Main } from '@/components/layout/main.tsx'
import MainTitleBar from '@/components/layout/main-title-bar.tsx'
import { AccountsPrimaryButtons } from '@/features/accounts/components/accounts-primary-buttons.tsx'
import MainContent from '@/components/layout/main-content.tsx'
import { AccountsDialogs } from '@/features/accounts/components/accounts-dialogs.tsx'
import { AccountsTable } from '@/features/accounts/components/accounts-table.tsx'
import { columns } from '@/features/accounts/components/accounts-columns.tsx'
import { useTranslation } from 'react-i18next'


export default function AccountsPage() {
  const { t } = useTranslation()
  const routeApi = getRouteApi('/_authenticated/accounts/')
  const { page, limit } = routeApi.useSearch()

  const query = useQuery({
    queryKey: ['accounts-list', page, limit ],
    queryFn: async () => await listAccountInfos({ page, limit }),
  })

  return (
    <AccountsProvider>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={t('layout.navigate.items.account')}
          description={t('apps.accounts.description')}
          >
          <AccountsPrimaryButtons />
        </MainTitleBar>

        <MainContent>
          {query.isFetched && query.data && (
            <AccountsTable
              columns={columns}
              data={query.data.data}
              page={page}
              limit={limit}
              total={query.data.total}
              />
          )}
        </MainContent>
      </Main>

      <AccountsDialogs />
    </AccountsProvider>
  )
}
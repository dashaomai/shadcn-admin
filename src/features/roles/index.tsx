import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { listRoles } from '@/api/auth'
import MainContent from '@/components/layout/main-content.tsx'
import MainHeader from '@/components/layout/main-header.tsx'
import MainTitleBar from '@/components/layout/main-title-bar.tsx'
import { Main } from '@/components/layout/main.tsx'
import { columns } from '@/features/roles/components/roles-columns.tsx'
import { RolesDialogs } from '@/features/roles/components/roles-dialogs.tsx'
import { RolesPrimaryButtons } from '@/features/roles/components/roles-primary-buttons.tsx'
import { RolesTable } from '@/features/roles/components/roles-table.tsx'
import RolesProvider from '@/features/roles/context/roles-context.tsx'
import { useTranslation } from 'react-i18next'

export default function RolesPage() {
  const { t } = useTranslation()
  
  const routeApi = getRouteApi('/_authenticated/roles/')
  const { page, limit } = routeApi.useSearch()

  const query = useQuery({
    queryKey: ['roles-list', page, limit],
    queryFn: async () =>
      await listRoles({
        page,
        limit,
      }),
  })

  return (
    <RolesProvider>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={t('layout.navigate.items.role')}
          description={t('apps.roles.description')}
        >
          <RolesPrimaryButtons />
        </MainTitleBar>

        <MainContent>
          {query.isFetched && query.data && (
            <RolesTable
              columns={columns}
              page={page}
              limit={limit}
              total={query.data.total}
              data={query.data.data}
            />
          )}
        </MainContent>
      </Main>

      <RolesDialogs />
    </RolesProvider>
  )
}
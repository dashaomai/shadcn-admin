import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useOperations } from '@/api/system/operations'
import { Main } from '@/components/layout/main'
import MainContent from '@/components/layout/main-content'
import MainHeader from '@/components/layout/main-header'
import MainTitleBar from '@/components/layout/main-title-bar'
import TablesProvider from '../tables/context/tables-context'
import { columns } from './components/operations-columns'
import { OperationsPrimaryButtons } from './components/operations-primary-buttons'
import { OperationsTable } from './components/operations-table'

export default function OperationsPage() {
  const { t } = useTranslation()
  const routeApi = getRouteApi('/_authenticated/operations/')
  const { page, limit } = routeApi.useSearch()

  const query = useOperations(page, limit)

  if (query.isFetching) {
    return <p>Loading</p>
  } else if (query.isError) {
    return <p>Error</p>
  }

  return (
    <TablesProvider>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={t('layout.navigate.items.table')}
          description={t('apps.tables.description')}
        >
          <OperationsPrimaryButtons />
        </MainTitleBar>

        <MainContent>
          <OperationsTable
            columns={columns}
            data={query.data!.data}
            page={page}
            limit={limit}
            total={query.data!.total}
          />
        </MainContent>
      </Main>
    </TablesProvider>
  )
}

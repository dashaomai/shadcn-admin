import { i18n } from '@/lib/i18n'
import MainContent from '@/components/layout/main-content.tsx'
import MainHeader from '@/components/layout/main-header.tsx'
import MainTitleBar from '@/components/layout/main-title-bar.tsx'
import { Main } from '@/components/layout/main.tsx'
import RolesProvider from '@/features/roles/context/roles-context.tsx'

export default function RolesPage() {
  return (
    <RolesProvider>
      <MainHeader />

      <Main>
        <MainTitleBar
          title={i18n.t('layout.navigate.items.role')}
          description={i18n.t('apps.roles.description')}
        >
          <p>角色管理按钮</p>
        </MainTitleBar>

        <MainContent>
          <p>角色列表</p>
        </MainContent>
      </Main>
    </RolesProvider>
  )
}
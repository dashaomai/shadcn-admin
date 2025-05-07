import { i18n } from '@/lib/i18n'
import ContentSection from '../components/content-section'
import { AccountForm } from './account-form'

export default function SettingsAccount() {
  return (
    <ContentSection
      title={i18n.t('settings.account.title')}
      desc={i18n.t('settings.account.description')}
    >
      <AccountForm />
    </ContentSection>
  )
}

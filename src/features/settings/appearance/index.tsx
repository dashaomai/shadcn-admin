import { i18n } from '@/lib/i18n'
import ContentSection from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export default function SettingsAppearance() {
  return (
    <ContentSection
      title={i18n.t('settings.appearance.title')}
      desc={i18n.t('settings.appearance.description')}
    >
      <AppearanceForm />
    </ContentSection>
  )
}

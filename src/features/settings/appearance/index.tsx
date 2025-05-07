import { useTranslation } from 'react-i18next'
import ContentSection from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export default function SettingsAppearance() {
  const { t } = useTranslation()
  
  return (
    <ContentSection
      title={t('settings.appearance.title')}
      desc={t('settings.appearance.description')}
    >
      <AppearanceForm />
    </ContentSection>
  )
}

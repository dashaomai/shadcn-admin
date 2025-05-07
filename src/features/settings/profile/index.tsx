import { i18n } from '@/lib/i18n'
import ContentSection from '../components/content-section'
import ProfileForm from './profile-form'

export default function SettingsProfile() {
  return (
    <ContentSection
      title={i18n.t('settings.profile.title')}
      desc={i18n.t('settings.profile.description')}
    >
      <ProfileForm />
    </ContentSection>
  )
}

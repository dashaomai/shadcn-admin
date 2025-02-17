import { Header } from '@/components/layout/header.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { Search } from '@/components/search.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'

export default function MainHeader() {
  return (
    <Header fixed>
      <Search />
      <div className='ml-auto flex items-center space-x-4'>
        <ThemeSwitch />
        <ProfileDropdown />
      </div>
    </Header>
  )
}
import { Header } from '@/components/layout/header.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { Search } from '@/components/search.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'

export interface MainHeaderProps extends React.HTMLAttributes<HTMLElement> {
  inner?: boolean
}

export default function MainHeader({inner}: MainHeaderProps) {
  return (
    <Header fixed={!inner}>
      <Search />
      <div className='ml-auto flex items-center space-x-4'>
        <ThemeSwitch />
        <ProfileDropdown />
      </div>
    </Header>
  )
}
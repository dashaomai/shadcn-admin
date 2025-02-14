import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { getProfile } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { i18next } from '@/lib/i18n'
import { getFallback } from '@/utils/avatar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

export function NavUser() {
  const { isMobile } = useSidebar()
  const authStore = useAuthStore()
  const profileQuery = useQuery({
    queryKey: ['self-profile'],
    queryFn: async () => getProfile(),
  })

  if (profileQuery.isFetching) {
    return <Skeleton className='h-12 w-12 rounded-full' />
  } else if (profileQuery.isError) {
    return <p>{profileQuery.error?.message}</p>
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage
                  src={profileQuery.data?.avatar}
                  alt={profileQuery.data?.nickname}
                />
                <AvatarFallback className='rounded-lg'>
                  {getFallback(profileQuery.data?.nickname)}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {profileQuery.data?.nickname}
                </span>
                <span className='truncate text-xs'>
                  {profileQuery.data?.email}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage
                    src={profileQuery.data?.avatar}
                    alt={profileQuery.data?.nickname}
                  />
                  <AvatarFallback className='rounded-lg'>
                    {getFallback(profileQuery.data?.nickname)}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {profileQuery.data?.nickname}
                  </span>
                  <span className='truncate text-xs'>
                    {profileQuery.data?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to='/settings/account'>
                  <BadgeCheck />
                  {i18next.t('layout account profile')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to='/settings'>
                  <CreditCard />
                  {i18next.t('layout account billing')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to='/settings/notifications'>
                  <Bell />
                  {i18next.t('layout account settings')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link onClick={() => authStore.auth.reset()}>
                <LogOut />
                {i18next.t('auth signOut')}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

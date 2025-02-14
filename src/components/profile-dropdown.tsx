import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { getProfile } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { i18next } from '@/lib/i18n'
import { getFallback } from '@/utils/avatar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

export function ProfileDropdown() {
  const authStore = useAuthStore()
  const profile = useQuery({
    queryKey: ['self-profile'],
    queryFn: async () => getProfile(),
  })

  if (profile.isFetching) {
    return <Skeleton className='h-12 w-12 rounded-full' />
  } else if (profile.isError) {
    return <p>{profile.error?.message}</p>
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={profile.data?.profile.avatar}
              alt={profile.data?.profile.nickname}
            />
            <AvatarFallback>
              {getFallback(profile.data?.profile.nickname)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {profile.data?.profile.nickname}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {profile.data?.profile.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              {i18next.t('layout account profile')}
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              {i18next.t('layout account billing')}
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              {i18next.t('layout account settings')}
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link onClick={() => authStore.auth.reset()}>
            {i18next.t('auth signOut')}
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

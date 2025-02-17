import { Link } from '@tanstack/react-router'
import { useProfile } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { i18n } from '@/lib/i18n'
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
  const profileQuery = useProfile()

  if (profileQuery.isFetching) {
    return <Skeleton className='h-12 w-12 rounded-full' />
  } else if (profileQuery.isError) {
    return <p>{profileQuery.error?.message}</p>
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={profileQuery.data?.avatar}
              alt={profileQuery.data?.nickname}
            />
            <AvatarFallback>
              {getFallback(profileQuery.data?.nickname)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {profileQuery.data?.nickname}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {profileQuery.data?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              {i18n.t('layout.account.profile')}
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              {i18n.t('layout.account.billing')}
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              {i18n.t('layout.account.settings')}
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link onClick={() => authStore.auth.reset()}>
            {i18n.t('auth.signOut')}
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

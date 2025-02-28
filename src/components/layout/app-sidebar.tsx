import { useRoles } from '@/api/auth'
import { rolesCheck } from '@/lib/role'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { Skeleton } from '../ui/skeleton'
import { sidebarData } from './data/sidebar-data'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const rolesQuery = useRoles()

  if (rolesQuery.isFetching) {
    return <Skeleton className='h-12 w-12 rounded-full' />
  } else if (rolesQuery.isError) {
    return <p>{rolesQuery.error.message}</p>
  }

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups
          .filter((group) => rolesCheck(rolesQuery.data, group.roles))
          .map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

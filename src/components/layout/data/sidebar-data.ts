import {
  IconBrandYoutube,
  IconCheckupList,
  IconHelp,
  IconLayoutDashboard,
  IconLockAccess,
  IconLogs,
  IconPalette,
  IconSettings,
  IconSpade,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react'
import { AudioWaveform } from 'lucide-react'
import { type SidebarData } from '../types'

// 至少是主播
const gteAnchor = ['superadmin', 'admin', 'anchor']

// 至少是管理员
const gteAdmin = ['superadmin', 'admin']

// 必须是主播
const isAnchor = ['anchor']

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'layout.teams.name',
      logo: AudioWaveform,
      plan: 'layout.plans.startup',
    },
  ],
  navGroups: [
    {
      title: 'layout.navigate.groups.normal',
      roles: gteAnchor,
      items: [
        {
          title: 'layout.navigate.items.dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: 'layout.navigate.groups.authorize',
      roles: gteAdmin,
      items: [
        {
          title: 'layout.navigate.items.console-account',
          icon: IconLockAccess,
          items: [
            {
              title: 'layout.navigate.items.role',
              url: '/roles',
              icon: IconCheckupList,
            },
            {
              title: 'layout.navigate.items.account',
              url: '/accounts',
              icon: IconUsers,
            },
          ],
        },
      ],
    },
    {
      title: 'layout.navigate.groups.broadcast',
      roles: isAnchor,
      items: [
        {
          title: 'layout.navigate.items.broadcast',
          icon: IconBrandYoutube,
          items: [
            {
              title: 'layout.navigate.items.bc_baccarat',
              url: '/tables?gameId=1',
              icon: IconSpade,
            },
          ],
        },
      ],
    },
    {
      title: 'layout.navigate.groups.system',
      roles: gteAdmin,
      items: [
        {
          title: 'layout.navigate.items.operation-logs',
          icon: IconLogs,
          url: '/operations',
        },
      ],
    },
    {
      title: 'layout.navigate.groups.personal',
      items: [
        {
          title: 'layout.navigate.items.settings',
          icon: IconSettings,
          items: [
            {
              title: 'layout.navigate.items.profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'layout.navigate.items.appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
          ],
        },
      ],
    },
  ],
}

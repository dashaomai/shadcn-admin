import {
  IconBrandYoutube,
  IconBrowserCheck,
  IconCheckupList,
  IconHelp,
  IconLayoutDashboard,
  IconLockAccess,
  IconNotification,
  IconPalette,
  IconSettings,
  IconSpade,
  IconTool,
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
      title: 'layout.navigate.groups.personal',
      items: [
        {
          title: 'layout.navigate.items.settings',
          icon: IconSettings,
          items: [
            {
              title: 'layout.navigate.items.settings',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'layout.navigate.items.account-setting',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'layout.navigate.items.appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'layout.navigate.items.notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'layout.navigate.items.display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'layout.navigate.items.help-center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}

import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconCheckupList,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconNotification,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { AudioWaveform } from 'lucide-react'
import { type SidebarData } from '../types'

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
      roles: ['superadmin', 'admin', 'agent'],
      items: [
        {
          title: 'layout.navigate.items.dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: 'layout.navigate.groups.system',
      roles: ['superadmin', 'admin'],
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
        {
          title: 'layout.navigate.items.game-hall',
          icon: IconBug,
          items: [
            {
              title: 'layout.navigate.items.game',
              url: '/401',
              icon: IconLock,
            },
            {
              title: 'layout.navigate.items.hall',
              url: '/403',
              icon: IconUserOff,
            },
            {
              title: 'layout.navigate.items.maintain',
              url: '/503',
              icon: IconBarrierBlock,
              roles: ['sysadmin'],
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

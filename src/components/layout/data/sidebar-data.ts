import {
  IconBarrierBlock,
  IconBrandCodepen,
  IconBrandYoutube,
  IconBrowserCheck,
  IconBug,
  IconChartArrowsVertical,
  IconCheckupList,
  IconClubs,
  IconDeviceGamepad2,
  IconDice3,
  IconHelp,
  IconLayoutDashboard,
  IconLockAccess,
  IconNotification,
  IconPalette,
  IconPlant,
  IconSettings,
  IconSpade,
  IconTag,
  IconTool,
  IconUserCog,
  IconUsers,
  IconWall,
} from '@tabler/icons-react'
import { AudioWaveform } from 'lucide-react'
import { type SidebarData } from '../types'

// 至少是主播
const gteAnchor = ['superadmin', 'admin', 'anchor']

// 至少是管理员
const gteAdmin = ['superadmin', 'admin']

// 必须是超级管理员
const isSuperAdmin = ['superadmin']

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
      title: 'layout.navigate.groups.system',
      roles: gteAdmin,
      items: [
        {
          title: 'layout.navigate.items.base',
          icon: IconPlant,
          items: [
            {
              title: 'layout.navigate.items.platform',
              url: '/platforms',
              icon: IconBrandCodepen,
            },
            {
              title: 'layout.navigate.items.developer',
              url: '/developers',
              icon: IconDeviceGamepad2,
            },
            {
              title: 'layout.navigate.items.publisher',
              url: '/publishers',
              icon: IconChartArrowsVertical,
            },
            {
              title: 'layout.navigate.items.game-catalog',
              url: '/game-catalogs',
              icon: IconClubs,
            },
            {
              title: 'layout.navigate.items.tag',
              url: '/tags',
              icon: IconTag,
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
              icon: IconDice3,
            },
            {
              title: 'layout.navigate.items.hall',
              url: '/403',
              icon: IconWall,
            },
            {
              title: 'layout.navigate.items.maintain',
              url: '/503',
              icon: IconBarrierBlock,
              roles: isSuperAdmin,
            },
          ],
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
              title: 'layout.navigate.items.table',
              url: '/tables',
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

import {
  IconBrandYoutube,
  IconBroadcast,
  IconCheckupList,
  IconGift,
  IconLaurelWreath,
  IconLaurelWreath1,
  IconLayoutDashboard,
  IconLockAccess,
  IconLogs,
  IconPalette,
  IconSettings,
  IconSpade,
  IconUserCog,
  IconUsers,
  IconWoman,
} from '@tabler/icons-react'
import { AudioWaveform } from 'lucide-react'
import {
  gteAdmin,
  gteAnchor,
  gteAnchorManager,
  eqAnchor,
  eqAnchorManager,
} from '@/lib/role.ts'
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
      roles: gteAnchorManager,
      items: [
        {
          title: 'layout.navigate.items.console-account',
          icon: IconLockAccess,
          items: [
            {
              title: 'layout.navigate.items.role',
              url: '/roles',
              roles: gteAdmin,
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
      title: 'layout.navigate.groups.anchor',
      roles: eqAnchorManager,
      items: [
        {
          title: 'layout.navigate.items.anchors',
          icon: IconWoman,
          url: '/anchors',
        },
        {
          title: 'layout.navigate.items.summaries',
          icon: IconLaurelWreath1,
          url: '/anchorSummaries',
        },
        {
          title: 'layout.navigate.items.broadcasts',
          icon: IconBroadcast,
          url: '/broadcasts',
        },
        {
          title: 'layout.navigate.items.giftRecords',
          icon: IconGift,
          url: '/giftRecords',
        },
      ],
    },
    {
      title: 'layout.navigate.groups.broadcast',
      roles: eqAnchor,
      items: [
        {
          title: 'layout.navigate.items.broadcast',
          icon: IconBrandYoutube,
          items: [
            {
              title: 'layout.navigate.items.bc_baccarat',
              url: '/bc-baccarat-tables',
              icon: IconSpade,
            },
            {
              title: 'layout.navigate.items.bc_niuniu_s',
              url: '/bc-niuniu-tables',
              icon: IconSpade,
            },
            {
              title: 'layout.navigate.items.bc_pushdots',
              url: '/bc-pushdots-tables',
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

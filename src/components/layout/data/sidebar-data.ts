import {
  IconBrandYoutube,
  IconBroadcast,
  IconCheckupList,
  IconClubs,
  IconClubsFilled,
  IconDice2,
  IconDice2Filled,
  IconDice3,
  IconDice3Filled,
  IconDice,
  IconDiceFilled,
  IconGift,
  IconLaurelWreath1,
  IconLayoutDashboard,
  IconLockAccess,
  IconLogs,
  IconPalette,
  IconSettings,
  IconSpade,
  IconSpadeFilled,
  IconUserCog,
  IconUsers,
  IconWoman,
} from '@tabler/icons-react'
import { AudioWaveform } from 'lucide-react'
import {
  eqAnchor,
  eqAnchorManager,
  gteAdmin,
  gteAnchor,
  gteAnchorManager,
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
              title: 'apps.games.name.bc_baccarat',
              url: '/bc-baccarat-tables',
              icon: IconSpade,
            },
            {
              title: 'apps.games.name.bc_baccarat_sqz',
              url: '/bc-baccarat-sqz-tables',
              icon: IconSpadeFilled,
            },
            {
              title: 'apps.games.name.bc_niuniu_s',
              url: '/bc-niuniu-tables',
              icon: IconClubs,
            },
            {
              title: 'apps.games.name.bc_niuniu_s_sqz',
              url: '/bc-niuniu-sqz-tables',
              icon: IconClubsFilled,
            },
            {
              title: 'apps.games.name.bc_pushdot',
              url: '/bc-pushdot-tables',
              icon: IconDice3,
            },
            {
              title: 'apps.games.name.bc_pushdot_sqz',
              url: '/bc-pushdot-sqz-tables',
              icon: IconDice3Filled,
            },
            {
              title: 'apps.games.name.bc_tiengow_f',
              url: '/bc-tiengow-f-tables',
              icon: IconDice,
            },
            {
              title: 'apps.games.name.bc_tiengow_f_sqz',
              url: '/bc-tiengow-f-sqz-tables',
              icon: IconDiceFilled,
            },
            {
              title: 'apps.games.name.bc_tiengow_d',
              url: '/bc-tiengow-d-tables',
              icon: IconDice2,
            },
            {
              title: 'apps.games.name.bc_tiengow_d_sqz',
              url: '/bc-tiengow-d-sqz-tables',
              icon: IconDice2Filled,
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

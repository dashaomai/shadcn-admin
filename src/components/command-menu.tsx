import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  IconArrowRightDashed,
  IconDeviceLaptop,
  IconMoon,
  IconSun,
} from '@tabler/icons-react'
import { useRoles } from '@/api/auth'
import { i18n } from '@/lib/i18n'
import { rolesCheck } from '@/lib/role'
import { useSearch } from '@/context/search-context'
import { useTheme } from '@/context/theme-context'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { sidebarData } from './layout/data/sidebar-data'
import { ScrollArea } from './ui/scroll-area'
import { Skeleton } from './ui/skeleton'

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const rolesQuery = useRoles()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  if (rolesQuery.isFetching) {
    return <Skeleton className='h-12 w-36 rounded-sm' />
  } else if (rolesQuery.isError) {
    return <p>{rolesQuery.error.message}</p>
  }

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={i18n.t('layout.search.input-placeholder')} />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pr-1'>
          <CommandEmpty>
            {i18n.t('layout.search.no-results-found')}
          </CommandEmpty>
          {sidebarData.navGroups
            .filter((group) => rolesCheck(rolesQuery.data, group.roles))
            .map((group) => (
              <CommandGroup key={group.title} heading={i18n.t(group.title)}>
                {group.items
                  .filter((item) => rolesCheck(rolesQuery.data, item.roles))
                  .map((navItem, i) => {
                    if (navItem.url)
                      return (
                        <CommandItem
                          key={`${navItem.url}-${i}`}
                          value={i18n.t(navItem.title)}
                          onSelect={() => {
                            runCommand(() => navigate({ to: navItem.url }))
                          }}
                        >
                          <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                            <IconArrowRightDashed className='size-2 text-muted-foreground/80' />
                          </div>
                          {i18n.t(navItem.title)}
                        </CommandItem>
                      )

                    return navItem.items?.map((subItem, i) => (
                      <CommandItem
                        key={`${subItem.url}-${i}`}
                        value={i18n.t(subItem.title)}
                        onSelect={() => {
                          runCommand(() => navigate({ to: subItem.url }))
                        }}
                      >
                        <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                          <IconArrowRightDashed className='size-2 text-muted-foreground/80' />
                        </div>
                        {i18n.t(subItem.title)}
                      </CommandItem>
                    ))
                  })}
              </CommandGroup>
            ))}
          <CommandSeparator />
          <CommandGroup heading={i18n.t('layout.theme.title')}>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <IconSun /> <span>{i18n.t('layout.theme.light')}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <IconMoon className='scale-90' />
              <span>{i18n.t('layout.theme.dark')}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <IconDeviceLaptop />
              <span>{i18n.t('layout.theme.system')}</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}

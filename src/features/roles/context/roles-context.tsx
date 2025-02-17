import { useContext, useState } from 'react'
import { Role } from '@/schemas/role.ts'
import {
  createContext,
  ListAppsDialogType,
  ListAppsProps,
} from '@/lib/context.ts'
import useDialogState from '@/hooks/use-dialog-state.tsx'

const RolesContext = createContext<ListAppsDialogType, Role>()

export default function RolesProvider({ children }: ListAppsProps) {
  const [open, setOpen] = useDialogState<ListAppsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Role | null>(null)

  return (
    <RolesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RolesContext>
  )
}

export const useRoles = () => {
  const rolesContext = useContext(RolesContext)

  if (!rolesContext) {
    throw new Error(`useUserRoles must be used within <RolesContext>`)
  }

  return rolesContext
}
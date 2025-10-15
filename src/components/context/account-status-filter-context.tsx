import { createContext, ReactNode, useContext } from 'react'
import { AccountStatus } from '@/lib/auth.ts';
import { FilterProps } from '@/lib/option.ts';


type AccountStatusFilterProps = FilterProps<AccountStatus>

const AccountStatusFilterContext = createContext<
  AccountStatusFilterProps | undefined
>(undefined)

export default function AccountStatusFilterProvider({
  values,
  setValues,
  children,
}: AccountStatusFilterProps & { children: ReactNode }) {
  return (
    <AccountStatusFilterContext value={{ values, setValues }}>
      {children}
    </AccountStatusFilterContext>
  )
}

export const useAccountStatusFilter = () => {
  const context = useContext(AccountStatusFilterContext)

  if (!context) {
    throw new Error('useAccountStatusFilter must be used within <AccountStatusFilterContext>')
  }

  return context
}
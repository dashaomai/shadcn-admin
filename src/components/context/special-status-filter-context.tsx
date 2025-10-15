import { createContext, ReactNode, useContext } from 'react'
import { FilterProps } from '@/lib/option.ts';
import { SpecialStatus } from '@/features/anchors/data/anchor-info.ts';


type SpecialStatusFilterProps = FilterProps<SpecialStatus>

const SpecialStatusFilterContext = createContext<
  SpecialStatusFilterProps | undefined
>(undefined)

export default function SpecialStatusFilterProvider({
  values,
  setValues,
  children,
}: SpecialStatusFilterProps & { children: ReactNode }) {
  return (
    <SpecialStatusFilterContext value={{ values, setValues }}>
      {children}
    </SpecialStatusFilterContext>
  )
}

export const useSpecialStatusFilter = () => {
  const context = useContext(SpecialStatusFilterContext)

  if (!context) {
    throw new Error('useSpecialStatusFilter must be used within <AccountStatusFilterContext>')
  }

  return context
}
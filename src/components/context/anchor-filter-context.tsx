import { createContext, ReactNode, useContext } from 'react'
import { FilterProps } from '@/lib/option.ts';


type AnchorFilterProps = FilterProps<string>

const AnchorFilterContext = createContext<AnchorFilterProps | undefined>(
  undefined
)

export default function AnchorFilterProvider({
  values,
  setValues,
  children,
}: AnchorFilterProps & { children: ReactNode }) {
  return (
    <AnchorFilterContext value={{ values, setValues }}>
      {children}
    </AnchorFilterContext>
  )
}

export const useAnchorFilter = () => {
  const context = useContext(AnchorFilterContext)

  if (!context) {
    throw new Error("useAnchorFilter must be used within <AnchorFilterContext>")
  }

  return context
}
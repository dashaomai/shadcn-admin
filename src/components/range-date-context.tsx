import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
} from 'react'


type RangeDateProps = {
  begin: Date
  setBegin: Dispatch<SetStateAction<Date>>
  end: Date
  setEnd: Dispatch<SetStateAction<Date>>
}

const RangeDateContext = createContext<RangeDateProps | undefined>(undefined)

export default function RangeDateProvider({ begin, setBegin, end, setEnd, children }: RangeDateProps & { children: ReactNode }) {
  return (
    <RangeDateContext value={{begin, setBegin, end, setEnd }}>
      {children}
    </RangeDateContext>
  )
}

export const useRangeDate = () => {
  const context = useContext(RangeDateContext)

  if (!context) {
    throw new Error('useRangeDate must be used within <RangeDateContext>')
  }

  return context
}
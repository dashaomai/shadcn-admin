import {
  createContext,
  ReactNode,
  useContext,
} from 'react'
import { FilterProps } from '@/lib/option.ts'

type GameFilterProps = FilterProps<number>

const GameFilterContext = createContext<GameFilterProps | undefined>(undefined)

export default function GameFilterProvider({values, setValues, children }: GameFilterProps & { children: ReactNode }) {
  return (
    <GameFilterContext value={{ values, setValues }}>
      {children}
    </GameFilterContext>
  )
}

export const useGameFilter = () => {
  const context = useContext(GameFilterContext)

  if (!context) {
    throw new Error("useGameFilter must be used within <GameFilterContext>")
  }

  return context
}
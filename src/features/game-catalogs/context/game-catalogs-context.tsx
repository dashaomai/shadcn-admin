import { useContext, useState } from 'react'
import {
  createContext,
  ListAppsDialogType,
  ListAppsProps,
} from '@/lib/list-app'
import useDialogState from '@/hooks/use-dialog-state'
import { GameCatalogInfo } from '../data/game-catalog'

const GameCatalogContext = createContext<ListAppsDialogType, GameCatalogInfo>()

export default function GameCatalogsProvider({ children }: ListAppsProps) {
  const [open, setOpen] = useDialogState<ListAppsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<GameCatalogInfo | null>(null)

  return (
    <GameCatalogContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </GameCatalogContext>
  )
}

export const useGameCatalogs = () => {
  const gameCatalogContext = useContext(GameCatalogContext)

  if (!gameCatalogContext) {
    throw new Error(
      'useGameCatalogs must be used within a <GameCatalogProvider>'
    )
  }

  return gameCatalogContext
}

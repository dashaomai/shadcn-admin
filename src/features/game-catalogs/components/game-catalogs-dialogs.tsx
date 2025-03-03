import { useEffect } from 'react'
import { useGameCatalogs } from '../context/game-catalogs-context'
import { GameCatalogsActionDialog } from './game-catalogs-action-dialog'

export function GameCatalogsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useGameCatalogs()

  useEffect(() => {
    if (!open && setCurrentRow) {
      setCurrentRow(null)
    }
  }, [open, setCurrentRow])

  return (
    <>
      <GameCatalogsActionDialog
        key='game-catalog-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <GameCatalogsActionDialog
            key={`game-catalog-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => setOpen('update')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}

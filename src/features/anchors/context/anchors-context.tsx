import { useContext, useState } from 'react'
import { createContext, ListAppsProps } from '@/lib/list-app.ts';
import useDialogState from '@/hooks/use-dialog-state.tsx';
import { AnchorConfiguration } from '@/features/anchors/data/anchor-info.ts'

type AnchorsAppsDialogType = 'update'

const AnchorsContext = createContext<AnchorsAppsDialogType, AnchorConfiguration>()

export default function AnchorsProvider({ children }: ListAppsProps) {
  const [open, setOpen] = useDialogState<AnchorsAppsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AnchorConfiguration | null>(null)

  return (
    <AnchorsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </AnchorsContext>
  )
}

export const useAnchors = () => {
  const anchorsContext = useContext(AnchorsContext)

  if (!anchorsContext) {
    throw new Error('useAnchors() must be used within <AnchorsContext>')
  }

  return anchorsContext
}

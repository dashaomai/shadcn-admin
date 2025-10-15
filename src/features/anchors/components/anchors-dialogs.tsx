import { useAnchors } from '@/features/anchors/context/anchors-context.tsx'
import { useEffect } from 'react'

export function AnchorsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAnchors()

  useEffect(() => {
    if (!open && setCurrentRow) {
      setCurrentRow(null)
    }
  }, [open, setCurrentRow])

  return (
    <>
    </>
  )
}
import { createLazyFileRoute } from '@tanstack/react-router'
import GameCatalogsPage from '@/features/game-catalogs'

export const Route = createLazyFileRoute('/_authenticated/game-catalogs/')({
  component: GameCatalogsPage,
})

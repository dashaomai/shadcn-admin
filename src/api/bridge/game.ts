import { useQuery } from '@tanstack/react-query'
import { fetchAuthed } from '@/stores/authStore.ts'
import { GameInfo } from '@/features/games/data/game.ts'

export const getAllGames = async () => {
  return fetchAuthed<GameInfo[]>('/game/')
}

export const useAllGames = () =>
  useQuery({
    queryKey: ['all-games'],
    queryFn: getAllGames,
  })
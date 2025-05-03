import { fetchAuthed } from '@/stores/authStore.ts'
import { WrappedResponse } from '@/lib/response.ts'
import { GameInfo } from '@/features/games/data/game.ts'

export const listGames = async () => {
  return fetchAuthed<WrappedResponse<GameInfo[]>>('/game/')
}
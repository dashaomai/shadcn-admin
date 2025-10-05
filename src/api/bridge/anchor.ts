import { fetchAuthed } from '@/stores/authStore.ts'
import { AnchorInfo } from '@/features/games/data/anchor.ts'
import { useQuery } from '@tanstack/react-query'

export const getAllAnchors = async () => {
  return fetchAuthed<AnchorInfo[]>('/anchor/list', {
    method: 'POST',
    body: JSON.stringify({
      roleName: 'anchor',
      exclude: [],
      limit: 0,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const useAllAnchors = () =>
  useQuery({
    queryKey: ['all-anchors'],
    queryFn: getAllAnchors,
  })
import { fetchAuthed } from '@/stores/authStore.ts'

export type DomainInfo = {
  id: number
  status: number
  createdAt: string
  url: string
}

export const getDomain = async (id: number) => {
  return fetchAuthed<DomainInfo>(`/domain/${id}`)
}
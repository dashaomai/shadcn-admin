import { fetchAuthed } from '@/stores/authStore.ts'

export type VendorInfo = {
  id: number
  status: number
  createdAt: string
  name: string
  url: string
  description: string
}

export const getVendor = async () => {
  return fetchAuthed<VendorInfo>('/vendor/1')
}
import { BroadcastStatus } from '@/lib/broadcast.ts'

export type Broadcast = {
  anchorId: string
  status: BroadcastStatus
  begin: string
  end: string
  gameId: number
  table: string
  giftCount: number
  giftValue: string
}

export type BroadcastRow = {
  anchor: string
  time: string
  game: string
  table: string
  duration: string
  giftCount: number
  giftValue: string
}
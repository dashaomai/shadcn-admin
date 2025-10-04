export const enum BroadcastStatus {
  /** 离线 */
  Offline,
  /** 直播中 */
  Online,
}

export type AnchorSummary = {
  id: string
  nickname: string
  broadcastStatus: BroadcastStatus
  lastBegin: Date
  lastEnd?: Date
  lastGame: string
  broadcastCount: number
  broadcastDuration: number
  giftCount: number
  giftValue: number
}
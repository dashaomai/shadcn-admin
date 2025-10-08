export const enum BroadcastStatus {
  /** 未知 */
  Unknown,
  /** 直播中 */
  Online,
  /** 已完结 */
  Finished,
}

export type AnchorSummary = {
  anchorId: string
  broadcastStatus: BroadcastStatus
  lastBegin: string
  lastEnd: string
  lastGameId: number
  broadcastCount: number
  broadcastDuration: number
  giftCount: number
  giftValue: string
}

export type AnchorSummaryRow = {
  anchor: string
  status: string
  lastTime: string
  lastGame: string
  broadcastCount: number
  broadcastDuration: string
  giftCount: number
  giftValue: string
}
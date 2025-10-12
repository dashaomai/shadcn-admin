export const enum OrderStatus {
  Unknown,
  /** 已成单 */
  Finished,
  /** 待结算 */
  Pending,
  /** 失败 */
  Failed,
  /** 待确认 */
  Confirming = 10,
}

export type GiftRecord = {
  id: string
  orderId: string
  orderStatus: OrderStatus
  agentId: number
  memberId: string
  nickname: string
  anchorId: string
  createdAt: string
  gameId: number
  tableId: number
  tableName: string
  roundId: string
  giftId: number
  giftName: string
  count: number
  currencyId: string
  currencyName: string
  value: string
}

export type GiftRecordRow = {
  orderId: string
  player: string
  anchor: string
  time: string
  game: string
  roundId: string
  tableName: string
  giftName: string
  giftValue: string
  orderStatus: string
}
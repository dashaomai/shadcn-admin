export type BroadcastInfo = {
  accountId: string
  nickname: string
  email: string
  avatar: string
  tableId: number
  createdAt: string
}

export type TableInfo = {
  id: number
  gameId: number
  type: number
  status: number
  createdAt: string
  orders: number
  name: string
  broadcast: BroadcastInfo | null
}

/** 桌类型 */
export const enum TableType {
  Unknown = 0,
  // 正常桌
  Normal = 1,
  // 急速桌
  Fast = 2,
  // 超急速桌
  UltraFast = 3,
}

/** 桌状态 */
export const enum TableStatus {
  /** 已下线 */
  Offline = 0,
  /** 已上线 */
  Online = 1,
}

export const TableStatusDescriptions = ['offline', 'online']

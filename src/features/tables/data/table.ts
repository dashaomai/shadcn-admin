export type TableInfo = {
  id: number
  gameId: number
  status: number
  createdAt: string
  orders: number
  name: string
}

/** 桌状态 */
export const enum TableStatus {
  /** 已下线 */
  Offline = 0,
  /** 已上线 */
  Online = 1,
}

export const TableStatusDescriptions = ['offline', 'online']
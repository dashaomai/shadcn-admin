import { create } from 'zustand'
import { listTables } from '@/api/bridge/table'
import { BroadcastInfo, TableInfo } from '@/features/tables/data/table'

export type TableState = {
  broadcast: {
    gameId: number
    page: number
    limit: number
    total: number
    tables: TableInfo[]
    setParams: (gameId: number, page: number, limit: number) => Promise<void>
    matchId: (id: number, info: BroadcastInfo | null) => void
  }
}

export const useTableStore = create<TableState>()((set, get) => {
  return {
    broadcast: {
      gameId: 0,
      page: 0,
      limit: 0,
      total: 0,
      tables: [],
      setParams: async (gameId: number, page: number, limit: number) => {
        const tablesResp = await listTables({ gameId, page, limit })
        const tables = tablesResp?.data ?? []
        const total = tablesResp?.total ?? 0
        const broadcast = get().broadcast

        set((state) => ({
          ...state,
          broadcast: {
            ...broadcast,
            gameId,
            page,
            limit,
            total,
            tables,
          },
        }))
      },
      matchId: (id: number, info: BroadcastInfo | null) => {
        const broadcast = get().broadcast
        const { tables } = broadcast
        const pos = tables.findIndex((t) => t.id === id)
        if (pos > -1) {
          tables[pos].broadcast = info

          set((state) => ({
            ...state,
            broadcast: {
              ...broadcast,
              tables: [...tables],
            },
          }))
        }
      },
    },
  }
})

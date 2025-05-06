import { create } from 'zustand'
import {
  BroadcastInfo,
  createBroadcast,
  CreateBroadcastRequest,
  finishBroadcast,
  getBroadcast,
} from '@/api/vod/broadcast'

interface BroadcastState {
  broadcast: BroadcastInfo | undefined
  setBroadcast: (broadcastInfo: BroadcastInfo | undefined) => void
  createBroadcast: (request: CreateBroadcastRequest) => Promise<void>
  finishBroadcast: () => Promise<void>
}

export const useBroadcastStore = create<BroadcastState>()((set, get) => {
  getBroadcast().then((broadcastInfo) => {
    get().setBroadcast(broadcastInfo)
  })

  return {
    broadcast: undefined,
    setBroadcast: (broadcastInfo: BroadcastInfo | undefined) => {
      set((state) => ({ ...state, broadcast: broadcastInfo }))
    },
    createBroadcast: async (request: CreateBroadcastRequest) => {
      const broadcast = await createBroadcast(request)

      get().setBroadcast(broadcast)
    },
    finishBroadcast: async () => {
      const id = await finishBroadcast()
      if (id === get().broadcast?.id && id) {
        get().setBroadcast(undefined)
      }
    },
  }
})
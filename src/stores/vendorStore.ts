import { create } from 'zustand'
import { getVendor, VendorInfo } from '@/api/vod/vendor.ts'

interface VendorState {
  vendor: VendorInfo | undefined
  setVendor: (vendor: VendorInfo | undefined) => void
}

export const useVendorStore = create<VendorState>()((set, get) => {
  getVendor().then((vendor) => {
    get().setVendor(vendor)
  })

  return {
    vendor: undefined,
    setVendor: (vendor: VendorInfo) => {
      set((state) => ({ ...state, vendor }))
    },
  }
})
import { AccountStatus } from '@/lib/auth.ts'

export enum SpecialStatus {
  /** 普通展示顺序 */
  Normal,
  /** 优先显示 */
  Top,
}

export type AnchorConfiguration = {
  id: string
  status: AccountStatus
  nickname: string
  avatar: string
  specialStatus: SpecialStatus
}
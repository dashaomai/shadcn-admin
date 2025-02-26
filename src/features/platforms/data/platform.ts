export interface PlatformInfo {
  id: number
  type: PlatformType
  name: string
  description: string
  status: PlatformStatus
  createdAt: string
}

/**
 * 平台类型
 */
export const enum PlatformType {
  /** 未知 */
  Unknown = 0,
  /** 自有 */
  Private = 1,
  /** 合作 */
  Cooperate = 2,
  /** 第三方 */
  ThirdPart = 3,
}

export const PlatformTypeDescriptions = [
  'unknown',
  'private',
  'cooperate',
  'thirdpart',
]

/** 平台状态 */
export const enum PlatformStatus {
  /** 已下线 */
  Offline = 0,
  /** 意向 */
  Intention = 1,
  /** 正在接入 */
  Developing = 2,
  /** 已上线 */
  Online = 3,
}

export const PlatformStatusDescriptions = [
  'offline',
  'intention',
  'developing',
  'online',
]

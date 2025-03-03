export interface PublisherInfo {
  id: number
  type: PublisherType
  name: string
  description: string
  status: PublisherStatus
  createdAt: string
}

/** 发行商类型 */
export const enum PublisherType {
  /** 未知 */
  Unknown = 0,
  /** 部门 */
  Department = 1,
  /** 子公司 */
  Subsidiary = 2,
  /** 第三方 */
  ThirdParty = 3,
}

export const PublisherTypeDescriptions = [
  'unknown',
  'department',
  'subsidiary',
  'thirdparty',
]

/** 发行商状态 */
export const enum PublisherStatus {
  /** 停用 */
  Disabled = 0,
  /** 启用 */
  Enabled = 1,
  /** 暂缓 */
  Pending = 2,
}

export const PublisherStatusDescriptions = ['disabled', 'enabled', 'pending']

export interface DeveloperInfo {
  id: number
  type: number
  name: string
  description: string
  status: number
  createdAt: string
}

/** 开发商类型 */
export const enum DeveloperType {
  /** 未知 */
  Unknown = 0,
  /** 部门 */
  Department = 1,
  /** 子公司 */
  Subsidiary = 2,
  /** 个人外包 */
  Individual = 3,
  /** 工作室外包 */
  Studio = 4,
  /** 公司外包 */
  Company = 5,
}

export const DeveloperTypeDescriptions = [
  'unknown',
  'department',
  'subsidiary',
  'individual',
  'studio',
  'company',
]

/** 开发商状态 */
export const enum DeveloperStatus {
  /** 未知 */
  Unknown = 0,
  /** 正常 */
  Normal = 1,
  /** 冻结 */
  Frozen = 2,
  /** 删除 */
  Deleted = 3,
}

export const DeveloperStatusDescriptions = [
  'unknown',
  'normal',
  'frozen',
  'deleted',
]

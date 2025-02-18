import { Roles } from './auth'

export type Role = {
  id: number
  name: string
  description: string
}

export type CreateOrUpdateRoleResponse = {
  id: number
}

/**
 * 检查用户权限与资源要求达到的权限候选清单是否匹配，即用户是否有权执行后续的操作。
 * @param roles 用户拥有的权限
 * @param candidates 应该拥有的权限候选列表
 * @returns 用户权限中是否有与候选列表匹配的权限
 */
export const rolesCheck = (
  roles: Roles | undefined,
  candidates: Roles | undefined
): boolean => {
  if (isEmptyArray(roles)) {
    return false
  } else if (isEmptyArray(candidates)) {
    return true
  }

  for (const candidate of candidates!) {
    for (const role of roles!) {
      if (role === candidate) {
        return true
      }
    }
  }

  return false
}

export const isEmptyArray = (values: Array<unknown> | undefined): boolean =>
  !Array.isArray(values) || values.length === 0

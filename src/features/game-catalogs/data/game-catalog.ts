export interface GameCatalogInfo {
  id: number
  name: string
  description: string
  displayOrder: number
  status: number
  createdAt: string
}

/** 游戏类别状态 */
export const enum GameCatalogStatus {
  /** 草稿 */
  Draft = 0,
  /** 已发布 */
  Published = 1,
  /** 已删除 */
  Deleted = 2,
}

export const GameCatalogStatusDescriptions = ['draft', 'published', 'deleted']
